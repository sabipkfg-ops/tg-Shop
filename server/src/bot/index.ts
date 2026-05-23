import { Telegraf } from 'telegraf'
import { setupAdminFlow } from './adminFlow'

const ADMIN_IDS = (process.env.ADMIN_TELEGRAM_ID ?? '')
  .split(',')
  .map((id) => Number(id.trim()))
  .filter(Boolean)

export function createBot(token: string, frontendUrl: string) {
  const bot = new Telegraf(token)

  // Пустые команды для всех пользователей (никаких команд не видно)
  bot.telegram.setMyCommands([])

  // Админские команды только для админов
  for (const adminId of ADMIN_IDS) {
    bot.telegram.setMyCommands(
      [
        { command: 'add', description: 'Добавить товар' },
        { command: 'list', description: 'Список товаров' },
        { command: 'edit', description: 'Редактировать: /edit {id}' },
        { command: 'delete', description: 'Удалить: /delete {id}' },
        { command: 'cancel', description: 'Отменить' },
      ],
      { scope: { type: 'chat', chat_id: adminId } }
    )
  }

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
