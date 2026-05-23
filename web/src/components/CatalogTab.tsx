'use client'

import { useState, useEffect, useCallback } from 'react'
import { Product, Filters, Lang } from '@/types'
import { t } from '@/i18n'
import { getProducts } from '@/lib/api'
import { ProductCard } from './ProductCard'
import { ProductDetailModal } from './ProductDetailModal'
import { CategoryBar } from './CategoryBar'
import { FilterModal } from './FilterModal'

type CatOption = 'ALL' | 'PANTS' | 'BAGS' | 'JACKETS' | 'HOODIES' | 'TEES' | 'SHOES'

const DEFAULT_FILTERS: Filters = { clothingSizes: [], shoeSizes: [], sort: 'asc' }

interface Props {
  lang: Lang
  telegramId: string | null
  favIds: Set<number>
  onToggleFav: (product: Product) => void
}

export function CatalogTab({ lang, telegramId, favIds, onToggleFav }: Props) {
  const [category, setCategory] = useState<CatOption>('ALL')
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Product | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getProducts({ category, filters })
      setProducts(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }, [category, filters])

  useEffect(() => { load() }, [load])

  const hasActiveFilters = filters.clothingSizes.length > 0 || filters.shoeSizes.length > 0

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <CategoryBar active={category} lang={lang} onFiltersClick={() => setShowFilters(true)} onCategoryChange={setCategory} />

      {hasActiveFilters && (
        <div className="px-4 py-1.5 bg-red-main/5 border-b border-red-main/20 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-red-main" />
          <span className="text-red-main text-xs font-mono uppercase tracking-widest">
            {[...filters.clothingSizes, ...filters.shoeSizes].join(' · ')}
          </span>
          <button onClick={() => setFilters(DEFAULT_FILTERS)} className="ml-auto text-text-muted text-xs">✕</button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-2">
        {loading ? (
          <div className="grid grid-cols-2 gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-sm bg-bg-3 border-distress animate-pulse">
                <div className="aspect-[3/4] bg-bg-3" />
                <div className="p-2 space-y-1.5">
                  <div className="h-3 bg-border rounded w-16" />
                  <div className="h-3 bg-border rounded w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center h-40">
            <p className="text-text-muted font-mono uppercase text-sm tracking-widest">{t(lang, 'emptyCatalog')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                isFav={favIds.has(p.id)}
                onClick={() => setSelected(p)}
                onToggleFav={(e) => { e.stopPropagation(); telegramId && onToggleFav(p) }}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ProductDetailModal
          product={selected}
          lang={lang}
          isFav={favIds.has(selected.id)}
          onToggleFav={() => telegramId && onToggleFav(selected)}
          onClose={() => setSelected(null)}
        />
      )}

      {showFilters && (
        <FilterModal initial={filters} lang={lang} onApply={setFilters} onClose={() => setShowFilters(false)} />
      )}
    </div>
  )
}