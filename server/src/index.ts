import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { createBot } from './bot'
import productsRouter from './api/products'
import favoritesRouter from './api/favorites'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: process.env.FRONTEND_URL }))
app.use(express.json())

// API routes
app.use('/api/products', productsRouter)
app.use('/api/favorites', favoritesRouter)

app.get('/health', (_, res) => res.json({ ok: true }))

// Start bot (long polling in dev, webhook in prod)
const bot = createBot()

if (process.env.NODE_ENV === 'production') {
const webhookUrl = `${process.env.SERVER_URL}/bot`
  app.use('/bot', express.json(), (req, res) => {
    bot.handleUpdate(req.body, res)
  })
  bot.telegram.setWebhook(webhookUrl).then(() => {
    console.log(`Webhook set: ${webhookUrl}`)
  })
} else {
  bot.launch().then(() => console.log('Bot polling started'))
  process.once('SIGINT', () => bot.stop('SIGINT'))
  process.once('SIGTERM', () => bot.stop('SIGTERM'))
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
