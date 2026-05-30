import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createBot } from './bot'
import productsRouter from './api/products'
import favoritesRouter from './api/favorites'
import { checkTelegramBots } from './lib/productPhoto'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({
  origin: [
    process.env.FRONTEND_URL ?? '',
    process.env.FRONTEND_URL_2 ?? '',
  ]
}))
app.use(express.json())

app.use('/api/products', productsRouter)
app.use('/api/favorites', favoritesRouter)
app.get('/health', (_, res) => res.json({ ok: true }))
app.get('/health/telegram', async (_, res) => {
  res.json({ bots: await checkTelegramBots() })
})

// Bot 1 — BIIRZHA
const bot1 = createBot(process.env.BOT_TOKEN!, process.env.FRONTEND_URL!, '1')

// Bot 2 — GRAIL
const bot2 = createBot(process.env.BOT_TOKEN_2!, process.env.FRONTEND_URL_2!, '2')

if (process.env.NODE_ENV === 'production') {
  app.use('/bot', (req, res) => { bot1.handleUpdate(req.body, res) })
  app.use('/bot2', (req, res) => { bot2.handleUpdate(req.body, res) })

  bot1.telegram.setWebhook(`${process.env.SERVER_URL}/bot`)
    .then(() => console.log('Bot1 webhook OK:', `${process.env.SERVER_URL}/bot`))
    .catch((e: Error) => console.error('Bot1 webhook ERROR:', e.message))

  bot2.telegram.setWebhook(`${process.env.SERVER_URL}/bot2`)
    .then(() => console.log('Bot2 webhook OK:', `${process.env.SERVER_URL}/bot2`))
    .catch((e: Error) => console.error('Bot2 webhook ERROR:', e.message))
} else {
  bot1.launch()
  bot2.launch()
  process.once('SIGINT', () => { bot1.stop(); bot2.stop() })
  process.once('SIGTERM', () => { bot1.stop(); bot2.stop() })
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))