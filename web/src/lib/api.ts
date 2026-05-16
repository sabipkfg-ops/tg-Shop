import { Category, Filters, Product } from '@/types'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export async function getProducts(params: {
  category?: Category | 'ALL'
  filters?: Filters
}): Promise<Product[]> {
  const { category, filters } = params
  const sp = new URLSearchParams()

  if (category && category !== 'ALL') sp.set('category', category)

  const sizes = [
    ...(filters?.clothingSizes ?? []),
    ...(filters?.shoeSizes ?? []),
  ]
  if (sizes.length) sp.set('sizes', sizes.join(','))
  if (filters?.sort) sp.set('sort', filters.sort)

  const res = await fetch(`${BASE}/api/products?${sp.toString()}`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error('Failed to fetch products')
  return res.json()
}

export async function getFavorites(telegramId: string): Promise<Product[]> {
  const res = await fetch(`${BASE}/api/favorites/${telegramId}`, {
    next: { revalidate: 0 },
  })
  if (!res.ok) throw new Error('Failed to fetch favorites')
  return res.json()
}

export async function addFavorite(telegramId: string, productId: number) {
  await fetch(`${BASE}/api/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ telegramId, productId }),
  })
}

export async function removeFavorite(telegramId: string, productId: number) {
  await fetch(`${BASE}/api/favorites/${telegramId}/${productId}`, {
    method: 'DELETE',
  })
}
