'use client'

import { useState } from 'react'
import Image from 'next/image'
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

export function FavoritesTab({
  lang,
  products,
  telegramId,
  favIds,
  onToggleFav,
}: Props) {
  const [selected, setSelected] = useState<Product | null>(null)

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="web2000-strip px-4 py-3 border-b border-border bg-bg-2 flex items-center gap-2">
        <Image
          src="/assets/favorite-filled.svg"
          alt=""
          width={22}
          height={28}
          className="favorite-icon header-favorite-icon"
          unoptimized
        />
        <h2 className="font-display text-lg tracking-widest uppercase text-text-primary">
          {t(lang, 'favorites')}
        </h2>
        <span className="ml-auto font-mono text-xs text-text-muted">
          {products.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {products.length === 0 ? (
          <div className="web2000-panel flex flex-col items-center justify-center h-48 gap-3">
            <Image
              src="/assets/favorite-outline.svg"
              alt=""
              width={46}
              height={56}
              className="favorite-icon empty-favorite-icon"
              unoptimized
            />
            <p className="text-text-muted font-mono uppercase text-sm tracking-widest">
              {t(lang, 'emptyFavorites')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                lang={lang}
                isFav={true}
                onToggleFav={telegramId ? () => onToggleFav(p) : undefined}
                onClick={() => setSelected(p)}
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
    </div>
  )
}
