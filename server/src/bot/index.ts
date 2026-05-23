import { Telegraf } from 'telegraf'
import { setupAdminFlow } from './adminFlow'

export function createBot(token: string, frontendUrl: string) {
  const bot = new Telegraf(token)

  bot.telegram.setMyCommands([
    { command: 'add', description: 'Добавить товар' },
    { command: 'list', description: 'Список товаров' },
    { command: 'edit', description: 'Редактировать товар: /edit {id}' },
    { command: 'delete', description: 'Удалить товар: /delete {id}' },
    { command: 'cancel', description: 'Отменить' },
  ])

  bot.start(async (ctx) => {
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