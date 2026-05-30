import { Router, Request, Response } from 'express'
import { Category } from '@prisma/client'
import { prisma } from '../lib/prisma'
import { mapProductForClient, sendProductPhoto } from '../lib/productPhoto'

const router = Router()

// GET /api/products
// Query: category, sizes (comma-separated), sort (asc|desc)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, sizes, sort } = req.query

    const where: Record<string, unknown> = {}

    // Category filter
    if (category && category !== 'ALL') {
      const validCategories = Object.values(Category) as string[]
      if (validCategories.includes(String(category))) {
        where.category = category as Category
      }
    }

    // Sizes filter — show products that have at least one of the selected sizes
    if (sizes && String(sizes).length > 0) {
      const sizeList = String(sizes)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
      if (sizeList.length > 0) {
        where.sizes = { hasSome: sizeList }
      }
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        price: sort === 'desc' ? 'desc' : 'asc',
      },
    })

    res.json(products.map(mapProductForClient))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/products/:id/photo
router.get('/:id/photo', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return res.status(404).json({ error: 'Not found' })

    const sent = await sendProductPhoto(product.photoUrl, res)
    if (!sent) return res.status(404).json({ error: 'Photo not found' })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/products/:id
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid id' })

    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) return res.status(404).json({ error: 'Not found' })

    res.json(mapProductForClient(product))
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
