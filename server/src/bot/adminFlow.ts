import { Telegraf, Markup } from 'telegraf'
import { Category, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_ID ?? '')
  .split(',')
  .map((id) => Number(id.trim()))
  .filter(Boolean)

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const SHOE_SIZES = Array.from({ length: 10 }, (_, i) => String(36 + i))

function isAdmin(id: number) {
  return ADMIN_IDS.includes(id)
}

async function getSession(telegramId: string) {
  return prisma.adminSession.upsert({
    where: { telegramId },
    update: {},
    create: { telegramId, step: null, data: {} },
  })
}

async function updateSession(
  telegramId: string,
  step: string | null,
  data?: Record<string, unknown>
) {
  return prisma.adminSession.upsert({
    where: { telegramId },
    update: { step, ...(data !== undefined && { data: data as Prisma.InputJsonValue }) },
    create: { telegramId, step, data: (data ?? {}) as Prisma.InputJsonValue },
  })
}

function buildSizesKeyboard(selected: string[]) {
  const btn = (size: string) =>
    Markup.button.callback(
      `${selected.includes(size) ? '✓ ' : ''}${size}`,
      `sz:${size}`
    )

  return Markup.inlineKeyboard([
    CLOTHING_SIZES.map(btn),
    SHOE_SIZES.slice(0, 5).map(btn),
    SHOE_SIZES.slice(5).map(btn),
    [Markup.button.callback('✅ Готово', 'sizes_done')],
  ])
}

export function setupAdminFlow(bot: Telegraf) {
  // ─── Commands ──────────────────────────────────────────────────────────────

  bot.command('add', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    await updateSession(String(ctx.from.id), 'awaiting_name_ru', {})
    await ctx.reply('📝 Введи название товара на *русском*:', {
      parse_mode: 'Markdown',
    })
  })

  bot.command('cancel', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    await updateSession(String(ctx.from.id), null, {})
    await ctx.reply('❌ Отменено.')
  })

  bot.command('list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
    })
    if (!products.length) return ctx.reply('Товаров нет.')
    const lines = products
      .map((p) => `#${p.id} | ${p.nameRu} | ${p.price}₽ | ${p.category}`)
      .join('\n')
    await ctx.reply(`*Последние товары:*\n\n${lines}`, {
      parse_mode: 'Markdown',
    })
  })

  bot.command('delete', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const id = parseInt(ctx.message.text.split(' ')[1] ?? '')
    if (isNaN(id)) return ctx.reply('Использование: /delete {id}')
    try {
      await prisma.product.delete({ where: { id } })
      await ctx.reply(`✅ Товар #${id} удалён.`)
    } catch {
      await ctx.reply(`❌ Товар #${id} не найден.`)
    }
  })

  // ─── Text messages (step machine) ─────────────────────────────────────────

  bot.on('text', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const session = await getSession(String(ctx.from.id))
    const data = (session.data as Record<string, unknown>) ?? {}

    switch (session.step) {
      case 'awaiting_name_ru':
        await updateSession(String(ctx.from.id), 'awaiting_name_en', {
          ...data,
          nameRu: ctx.message.text,
        })
        await ctx.reply('🇬🇧 Введи название на *английском*:', {
          parse_mode: 'Markdown',
        })
        break

      case 'awaiting_name_en':
        await updateSession(String(ctx.from.id), 'awaiting_price', {
          ...data,
          nameEn: ctx.message.text,
        })
        await ctx.reply('💰 Введи цену в рублях (только число):')
        break

      case 'awaiting_price': {
        const price = parseInt(ctx.message.text)
        if (isNaN(price) || price <= 0)
          return ctx.reply('❌ Введи корректное число:')
        await updateSession(String(ctx.from.id), 'awaiting_category', {
          ...data,
          price,
        })
        await ctx.reply(
          '📂 Выбери категорию:',
          Markup.inlineKeyboard([
            [
              Markup.button.callback('👖 Штаны', 'cat:PANTS'),
              Markup.button.callback('👜 Сумки', 'cat:BAGS'),
            ],
            [
              Markup.button.callback('🧥 Куртки', 'cat:JACKETS'),
              Markup.button.callback('🤙 Худи/Зипки', 'cat:HOODIES'),
            ],
          ])
        )
        break
      }
    }
  })

  // ─── Photo ────────────────────────────────────────────────────────────────

  bot.on('photo', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const session = await getSession(String(ctx.from.id))
    if (session.step !== 'awaiting_photo') return

    const data = (session.data as Record<string, unknown>) ?? {}
    const photo = ctx.message.photo.at(-1)!
    const file = await ctx.telegram.getFile(photo.file_id)
    const photoUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`

    try {
      const product = await prisma.product.create({
        data: {
          nameRu: String(data.nameRu),
          nameEn: String(data.nameEn),
          price: Number(data.price),
          category: data.category as Category,
          sizes: (data.sizes as string[]) ?? [],
          photoUrl,
        },
      })
      await updateSession(String(ctx.from.id), null, {})
      await ctx.reply(
        `✅ *Товар добавлен!*\n\n` +
          `${product.nameRu} / ${product.nameEn}\n` +
          `Цена: ${product.price}₽\n` +
          `Категория: ${product.category}\n` +
          `Размеры: ${product.sizes.join(', ') || '—'}`,
        { parse_mode: 'Markdown' }
      )
    } catch (e) {
      console.error(e)
      await ctx.reply('❌ Ошибка при сохранении.')
    }
  })

  // ─── Callbacks ────────────────────────────────────────────────────────────

  bot.action(/^cat:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from!.id)) return
    const category = ctx.match[1] as Category
    const session = await getSession(String(ctx.from!.id))
    const data = (session.data as Record<string, unknown>) ?? {}

    await updateSession(String(ctx.from!.id), 'awaiting_sizes', {
      ...data,
      category,
      sizes: [],
    })
    await ctx.editMessageText(
      '📏 Выбери доступные размеры (несколько, затем нажми Готово):',
      buildSizesKeyboard([])
    )
  })

  bot.action(/^sz:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from!.id)) return
    const size = ctx.match[1]
    const session = await getSession(String(ctx.from!.id))
    if (session.step !== 'awaiting_sizes') return

    const data = (session.data as Record<string, unknown>) ?? {}
    const current = (data.sizes as string[]) ?? []
    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size]

    await updateSession(String(ctx.from!.id), 'awaiting_sizes', {
      ...data,
      sizes: updated,
    })
    await ctx.editMessageReplyMarkup(buildSizesKeyboard(updated).reply_markup)
    await ctx.answerCbQuery(
      `${updated.includes(size) ? '✓' : '✗'} ${size}`
    )
  })

  bot.action('sizes_done', async (ctx) => {
    if (!isAdmin(ctx.from!.id)) return
    const session = await getSession(String(ctx.from!.id))
    const data = (session.data as Record<string, unknown>) ?? {}
    const sizes = (data.sizes as string[]) ?? []

    await updateSession(String(ctx.from!.id), 'awaiting_photo', data)
    await ctx.editMessageText(
      `✅ Размеры выбраны: ${sizes.length ? sizes.join(', ') : 'нет'}`
    )
    await ctx.reply('📸 Отправь фото товара:')
  })
}
