'use client'

import Image from 'next/image'
import { Product, Lang } from '@/types'

interface Props {
  product: Product
  lang: Lang
  isFav: boolean
  onClick: () => void
  onToggleFav?: () => void
}

export function ProductCard({ product, isFav, onClick, onToggleFav }: Props) {
  return (
    <div className="glitch-card border-distress rounded-sm bg-bg-2 w-full text-left relative">
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left active:scale-[0.97] transition-transform duration-100"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-bg-3">
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized
          />
        </div>

        <div className="p-2 pb-3">
          <p className="price-text text-base font-bold leading-tight">
            {product.price.toLocaleString('ru-RU')} {'\u20BD'}
          </p>
          <p className="text-text-primary text-sm mt-0.5 leading-snug line-clamp-2 font-display tracking-wide">
            {product.name}
          </p>
        </div>
      </button>

      <button
        type="button"
        disabled={!onToggleFav}
        onClick={(e) => {
          e.stopPropagation()
          onToggleFav?.()
        }}
        className={`absolute top-2 right-2 z-10 w-9 h-9 rounded-full border border-border bg-bg/90 text-xl leading-none flex items-center justify-center shadow-sm transition-colors ${
          isFav ? 'text-red-main' : 'text-text-secondary'
        } disabled:opacity-50`}
        aria-label="Toggle favorite"
      >
        {isFav ? '\u2665' : '\u2661'}
      </button>
    </div>
  )
}
