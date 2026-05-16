import { Telegraf } from 'telegraf'
import { setupAdminFlow } from './adminFlow'

export function createBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN!)

  // Bot menu commands (visible in Telegram UI)
  bot.telegram.setMyCommands([
    { command: 'add', description: 'Добавить товар' },
    { command: 'list', description: 'Список последних товаров' },
    { command: 'delete', description: 'Удалить товар: /delete {id}' },
    { command: 'cancel', description: 'Отменить добавление' },
  ])

  // Start message with Mini App button
  bot.start(async (ctx) => {
    const frontendUrl = process.env.FRONTEND_URL!
    await ctx.reply('👋 Добро пожаловать!', {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🛍 Открыть каталог', web_app: { url: frontendUrl } }],
        ],
      },
    })
  })

  setupAdminFlow(bot)

  return bot
}
