'use client'

import { useState } from 'react'
import { Product, Lang } from '@/types'
import { t } from '@/i18n'
import { ProductCard } from './ProductCard'
import { ProductDetailModal } from './ProductDetailModal'

interface Props {
  lang: Lang
  products: Product[]
  telegramId: string | null
  favIds: Set<number>
  onToggleFav: (product: Product) => void
}

export function FavoritesTab({ lang, products, telegramId, favIds, onToggleFav }: Props) {
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 py-3 border-b border-border bg-bg flex items-center gap-2">
        <span className="text-white">♥</span>
        <h2 className="text-base font-semibold text-white uppercase tracking-widest">{t(lang, 'favorites')}</h2>
        <span className="ml-auto text-text-muted text-xs">{products.length}</span>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-3">
            <span className="text-4xl text-text-muted">♡</span>
            <p className="text-text-muted text-sm uppercase tracking-widest">{t(lang, 'emptyFavorites')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} isFav={true}
                onClick={() => setSelected(p)}
                onToggleFav={(e) => { e.stopPropagation(); telegramId && onToggleFav(p) }}
              />
            ))}
          </div>
        )}
      </div>

      {selected && (
        <ProductDetailModal product={selected} lang={lang} isFav={favIds.has(selected.id)}
          onToggleFav={() => telegramId && onToggleFav(selected)} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
