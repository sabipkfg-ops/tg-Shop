export type Category = 'PANTS' | 'BAGS' | 'JACKETS' | 'HOODIES' | 'TEES' | 'SHOES'

export interface Product {
  id: number
  name: string
  price: number
  photoUrl: string
  category: Category
  sizes: string[]
  createdAt: string
  updatedAt: string
}

export type SortOrder = 'asc' | 'desc'

export interface Filters {
  clothingSizes: string[]
  shoeSizes: string[]
  sort: SortOrder
}

export type Tab = 'catalog' | 'favorites'
export type Lang = 'ru' | 'en'
