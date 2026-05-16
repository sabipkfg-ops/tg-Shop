import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma'

const router = Router()

// GET /api/favorites/:telegramId
router.get('/:telegramId', async (req: Request, res: Response) => {
  try {
    const { telegramId } = req.params
    const favorites = await prisma.favorite.findMany({
      where: { telegramId },
      include: { product: true },
      orderBy: { createdAt: 'desc' },
    })
    res.json(favorites.map((f) => f.product))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/favorites  { telegramId, productId }
router.post('/', async (req: Request, res: Response) => {
  try {
    const { telegramId, productId } = req.body
    if (!telegramId || !productId)
      return res.status(400).json({ error: 'telegramId and productId required' })

    const favorite = await prisma.favorite.create({
      data: { telegramId: String(telegramId), productId: Number(productId) },
    })
    res.status(201).json(favorite)
  } catch (e: unknown) {
    // Unique constraint = already favorited
    if ((e as { code?: string }).code === 'P2002')
      return res.status(409).json({ error: 'Already in favorites' })
    console.error(e)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// DELETE /api/favorites/:telegramId/:productId
router.delete('/:telegramId/:productId', async (req: Request, res: Response) => {
  try {
    const telegramId = req.params.telegramId
    const productId = parseInt(req.params.productId)

    await prisma.favorite.deleteMany({
      where: { telegramId, productId },
    })
    res.json({ success: true })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
