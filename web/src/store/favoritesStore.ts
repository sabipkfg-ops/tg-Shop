import { create } from 'zustand'
import { Product } from '@/types'
import { addFavorite, removeFavorite, getFavorites } from '@/lib/api'

interface FavoritesStore {
  favorites: Product[]
  ids: Set<number>
  loading: boolean
  fetch: (telegramId: string) => Promise<void>
  toggle: (telegramId: string, product: Product) => Promise<void>
  isFav: (id: number) => boolean
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favorites: [],
  ids: new Set(),
  loading: false,

  fetch: async (telegramId) => {
    set({ loading: true })
    try {
      const products = await getFavorites(telegramId)
      set({
        favorites: products,
        ids: new Set(products.map((p) => p.id)),
      })
    } catch (e) {
      console.error(e)
    } finally {
      set({ loading: false })
    }
  },

  toggle: async (telegramId, product) => {
    const { ids, favorites } = get()
    const isFav = ids.has(product.id)

    // Optimistic update
    if (isFav) {
      set({
        ids: new Set([...ids].filter((id) => id !== product.id)),
        favorites: favorites.filter((p) => p.id !== product.id),
      })
      await removeFavorite(telegramId, product.id)
    } else {
      set({
        ids: new Set([...ids, product.id]),
        favorites: [product, ...favorites],
      })
      await addFavorite(telegramId, product.id)
    }
  },

  isFav: (id) => get().ids.has(id),
}))
