import { Telegraf } from 'telegraf'
import { setupAdminFlow } from './adminFlow'

export function createBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN!)

  bot.telegram.setMyCommands([
    { command: 'add', description: 'Добавить товар' },
    { command: 'list', description: 'Показать все товары с ID' },
    { command: 'edit', description: 'Изменить товар: /edit {id}' },
    { command: 'delete', description: 'Удалить товар: /delete {id}' },
    { command: 'cancel', description: 'Отменить добавление' },
  ])

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
