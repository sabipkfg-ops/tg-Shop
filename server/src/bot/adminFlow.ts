import { Telegraf, Markup } from 'telegraf'
import { Category, Prisma } from '@prisma/client'
import { prisma } from '../lib/prisma'

const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_ID ?? '')
  .split(',')
  .map((id) => Number(id.trim()))
  .filter(Boolean)

const CLOTHING_SIZES = ['XS', 'S', 'M', 'L', 'XL']
const SHOE_SIZES = Array.from({ length: 10 }, (_, i) => String(36 + i))
const PANTS_SIZES = [
  '28/30', '28/32', '30/30', '30/32', '30/34',
  '32/30', '32/32', '32/34', '34/30', '34/32',
  '34/34', '36/30', '36/32', '36/34', '38/32', '38/34',
]

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
  const jsonData = data as Prisma.InputJsonValue | undefined
  return prisma.adminSession.upsert({
    where: { telegramId },
    update: { step, ...(jsonData !== undefined && { data: jsonData }) },
    create: { telegramId, step, data: (jsonData ?? {}) as Prisma.InputJsonValue },
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
    PANTS_SIZES.slice(0, 4).map(btn),
    PANTS_SIZES.slice(4, 8).map(btn),
    PANTS_SIZES.slice(8, 12).map(btn),
    PANTS_SIZES.slice(12).map(btn),
    [Markup.button.callback('✅ Готово', 'sizes_done')],
  ])
}

function buildCategoryKeyboard() {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('👖 Штаны', 'cat:PANTS'),
      Markup.button.callback('👜 Сумки', 'cat:BAGS'),
    ],
    [
      Markup.button.callback('🧥 Куртки', 'cat:JACKETS'),
      Markup.button.callback('🤙 Худи/Зипки', 'cat:HOODIES'),
    ],
    [
      Markup.button.callback('👕 Футболки', 'cat:TEES'),
      Markup.button.callback('👟 Обувь', 'cat:SHOES'),
    ],
  ])
}

function buildEditKeyboard(productId: number) {
  return Markup.inlineKeyboard([
    [
      Markup.button.callback('✏️ Название', `edit_field:${productId}:name`),
      Markup.button.callback('💰 Цена', `edit_field:${productId}:price`),
    ],
    [
      Markup.button.callback('📂 Категория', `edit_field:${productId}:category`),
      Markup.button.callback('📏 Размеры', `edit_field:${productId}:sizes`),
    ],
    [Markup.button.callback('📸 Фото', `edit_field:${productId}:photo`)],
  ])
}

export function setupAdminFlow(bot: Telegraf) {
  bot.command('add', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    await updateSession(String(ctx.from.id), 'awaiting_name', {})
    await ctx.reply('📝 Введи название товара:')
  })

  bot.command('cancel', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    await updateSession(String(ctx.from.id), null, {})
    await ctx.reply('❌ Отменено.')
  })

  bot.command('list', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
    if (!products.length) return ctx.reply('Товаров нет.')
    const chunkSize = 30
    for (let i = 0; i < products.length; i += chunkSize) {
      const chunk = products.slice(i, i + chunkSize)
      const lines = chunk.map((p) => `#${p.id} | ${p.name} | ${p.price}₽ | ${p.category}`).join('\n')
      await ctx.reply(`*Товары:*\n\n${lines}`, { parse_mode: 'Markdown' })
    }
  })

  bot.command('delete', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const id = parseInt(ctx.message.text.split(' ')[1] ?? '')
    if (isNaN(id)) return ctx.reply('Использование: /delete {id}')
    try {
      await prisma.product.delete({ where: { id } })
      await ctx.reply(`✅ Товар #${id} удалён.`)
    } catch { await ctx.reply(`❌ Товар #${id} не найден.`) }
  })

  bot.command('edit', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const id = parseInt(ctx.message.text.split(' ')[1] ?? '')
    if (isNaN(id)) return ctx.reply('Использование: /edit {id}')
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return ctx.reply(`❌ Товар #${id} не найден.`)
    await ctx.reply(
      `📦 *${product.name}*\n💰 ${product.price}₽ | ${product.category}\n📏 ${product.sizes.join(', ') || '—'}\n\nЧто изменить?`,
      { parse_mode: 'Markdown', ...buildEditKeyboard(id) }
    )
  })

  bot.on('text', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const session = await getSession(String(ctx.from.id))
    const data = (session.data as Record<string, unknown>) ?? {}

    switch (session.step) {
      case 'awaiting_name':
        await updateSession(String(ctx.from.id), 'awaiting_price', { ...data, name: ctx.message.text })
        await ctx.reply('💰 Введи цену в рублях:')
        break
      case 'awaiting_price': {
        const price = parseInt(ctx.message.text)
        if (isNaN(price) || price <= 0) return ctx.reply('❌ Введи корректное число:')
        await updateSession(String(ctx.from.id), 'awaiting_category', { ...data, price })
        await ctx.reply('📂 Выбери категорию:', buildCategoryKeyboard())
        break
      }
      case 'edit_name': {
        await prisma.product.update({ where: { id: Number(data.editId) }, data: { name: ctx.message.text } })
        await updateSession(String(ctx.from.id), null, {})
        await ctx.reply(`✅ Название обновлено: ${ctx.message.text}`)
        break
      }
      case 'edit_price': {
        const price = parseInt(ctx.message.text)
        if (isNaN(price) || price <= 0) return ctx.reply('❌ Введи корректное число:')
        await prisma.product.update({ where: { id: Number(data.editId) }, data: { price } })
        await updateSession(String(ctx.from.id), null, {})
        await ctx.reply(`✅ Цена обновлена: ${price}₽`)
        break
      }
    }
  })

  bot.on('photo', async (ctx) => {
    if (!isAdmin(ctx.from.id)) return
    const session = await getSession(String(ctx.from.id))
    const data = (session.data as Record<string, unknown>) ?? {}
    const photo = ctx.message.photo.at(-1)!
    const file = await ctx.telegram.getFile(photo.file_id)
    const photoUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`

    if (session.step === 'edit_photo') {
      await prisma.product.update({ where: { id: Number(data.editId) }, data: { photoUrl } })
      await updateSession(String(ctx.from.id), null, {})
      await ctx.reply('✅ Фото обновлено.')
      return
    }

    if (session.step !== 'awaiting_photo') return
    try {
      const product = await prisma.product.create({
        data: {
          name: String(data.name),
          price: Number(data.price),
          category: data.category as Category,
          sizes: (data.sizes as string[]) ?? [],
          photoUrl,
        },
      })
      await updateSession(String(ctx.from.id), null, {})
      await ctx.reply(
        `✅ *Товар добавлен!*\n\n${product.name}\nЦена: ${product.price}₽\nКатегория: ${product.category}\nРазмеры: ${product.sizes.join(', ') || '—'}`,
        { parse_mode: 'Markdown' }
      )
    } catch (e) {
      console.error(e)
      await ctx.reply('❌ Ошибка при сохранении.')
    }
  })

  bot.action(/^cat:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from!.id)) return
    const category = ctx.match[1] as Category
    const session = await getSession(String(ctx.from!.id))
    const data = (session.data as Record<string, unknown>) ?? {}

    if (session.step === 'edit_category') {
      await prisma.product.update({ where: { id: Number(data.editId) }, data: { category } })
      await updateSession(String(ctx.from!.id), null, {})
      await ctx.editMessageText(`✅ Категория обновлена: ${category}`)
      return
    }

    await updateSession(String(ctx.from!.id), 'awaiting_sizes', { ...data, category, sizes: [] })
    await ctx.editMessageText('📏 Выбери доступные размеры:', buildSizesKeyboard([]))
  })

  bot.action(/^sz:(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from!.id)) return
    const size = ctx.match[1]
    const session = await getSession(String(ctx.from!.id))
    if (session.step !== 'awaiting_sizes' && session.step !== 'edit_sizes') return
    const data = (session.data as Record<string, unknown>) ?? {}
    const current = (data.sizes as string[]) ?? []
    const updated = current.includes(size) ? current.filter((s) => s !== size) : [...current, size]
    await updateSession(String(ctx.from!.id), session.step, { ...data, sizes: updated })
    await ctx.editMessageReplyMarkup(buildSizesKeyboard(updated).reply_markup)
    await ctx.answerCbQuery(`${updated.includes(size) ? '✓' : '✗'} ${size}`)
  })

  bot.action('sizes_done', async (ctx) => {
    if (!isAdmin(ctx.from!.id)) return
    const session = await getSession(String(ctx.from!.id))
    const data = (session.data as Record<string, unknown>) ?? {}
    const sizes = (data.sizes as string[]) ?? []

    if (session.step === 'edit_sizes') {
      await prisma.product.update({ where: { id: Number(data.editId) }, data: { sizes } })
      await updateSession(String(ctx.from!.id), null, {})
      await ctx.editMessageText(`✅ Размеры обновлены: ${sizes.join(', ') || '—'}`)
      return
    }

    await updateSession(String(ctx.from!.id), 'awaiting_photo', data)
    await ctx.editMessageText(`✅ Размеры: ${sizes.length ? sizes.join(', ') : 'нет'}`)
    await ctx.reply('📸 Отправь фото товара:')
  })

  bot.action(/^edit_field:(\d+):(.+)$/, async (ctx) => {
    if (!isAdmin(ctx.from!.id)) return
    const productId = parseInt(ctx.match[1])
    const field = ctx.match[2]

    switch (field) {
      case 'name':
        await updateSession(String(ctx.from!.id), 'edit_name', { editId: productId })
        await ctx.editMessageText('✏️ Введи новое название:')
        break
      case 'price':
        await updateSession(String(ctx.from!.id), 'edit_price', { editId: productId })
        await ctx.editMessageText('💰 Введи новую цену:')
        break
      case 'category':
        await updateSession(String(ctx.from!.id), 'edit_category', { editId: productId })
        await ctx.editMessageText('📂 Выбери новую категорию:', buildCategoryKeyboard())
        break
      case 'sizes': {
        const product = await prisma.product.findUnique({ where: { id: productId } })
        await updateSession(String(ctx.from!.id), 'edit_sizes', { editId: productId, sizes: product?.sizes ?? [] })
        await ctx.editMessageText('📏 Выбери новые размеры:', buildSizesKeyboard(product?.sizes ?? []))
        break
      }
      case 'photo':
        await updateSession(String(ctx.from!.id), 'edit_photo', { editId: productId })
        await ctx.editMessageText('📸 Отправь новое фото:')
        break
    }
  })
}
