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
    <div className="web2000-card glitch-card border-distress rounded-sm bg-bg-2 w-full text-left relative">
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left active:scale-[0.97] transition-transform duration-100"
      >
        <div className="relative w-full aspect-[3/4] overflow-hidden bg-bg-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.photoUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
            decoding="async"
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
        className="favorite-button absolute top-2 right-2 z-10 w-10 h-10 flex items-center justify-center disabled:opacity-50"
        aria-label="Toggle favorite"
      >
        <Image
          src={isFav ? '/assets/favorite-filled.svg' : '/assets/favorite-outline.svg'}
          alt=""
          width={26}
          height={32}
          className="favorite-icon"
          unoptimized
        />
      </button>
    </div>
  )
}
