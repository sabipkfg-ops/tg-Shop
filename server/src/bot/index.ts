import { Telegraf } from 'telegraf'
import { setupAdminFlow } from './adminFlow'

const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_ID ?? '')
  .split(',')
  .map((id) => Number(id.trim()))
  .filter(Boolean)

export function createBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN!)

  // Обычные пользователи видят только /start
  bot.telegram.setMyCommands([
    { command: 'start', description: 'Открыть каталог' },
  ])

  // Администраторы видят полный список команд
  for (const adminId of ADMIN_IDS) {
    bot.telegram.setMyCommands(
      [
        { command: 'start', description: 'Открыть каталог' },
        { command: 'add', description: 'Добавить товар' },
        { command: 'list', description: 'Показать все товары с ID' },
        { command: 'edit', description: 'Изменить товар: /edit {id}' },
        { command: 'delete', description: 'Удалить товар: /delete {id}' },
        { command: 'cancel', description: 'Отменить добавление' },
      ],
      { scope: { type: 'chat', chat_id: adminId } }
    ).catch(() => {/* admin may not have started the bot yet */})
  }

  bot.start(async (ctx) => {
    const frontendUrl = process.env.FRONTEND_URL!
    await ctx.reply('Добро пожаловать!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Открыть каталог', web_app: { url: frontendUrl } }],
        ],
      },
    })
  })

  setupAdminFlow(bot)

  return bot
}
