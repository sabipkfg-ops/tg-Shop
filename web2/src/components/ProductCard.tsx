'use client'

import Image from 'next/image'
import { Product } from '@/types'

interface Props {
  product: Product
  isFav: boolean
  onClick: () => void
  onToggleFav: (e: React.MouseEvent) => void
}

function isNew(createdAt: string): boolean {
  const diff = Date.now() - new Date(createdAt).getTime()
  return diff < 7 * 24 * 60 * 60 * 1000 // 7 days
}

export function ProductCard({ product, isFav, onClick, onToggleFav }: Props) {
  return (
    <button onClick={onClick} className="product-card w-full text-left">
      {/* Photo */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-bg-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.photoUrl}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
        {/* NEW badge */}
        {isNew(product.createdAt) && (
          <span className="absolute top-2 left-2 bg-white text-black text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider">
            NEW
          </span>
        )}
        {/* Heart button */}
        <button
          onClick={onToggleFav}
          className={`absolute top-2 right-2 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 backdrop-blur-sm text-base transition-all active:scale-110 ${
            isFav ? 'text-white' : 'text-white/50'
          }`}
        >
          {isFav ? '♥' : '♡'}
        </button>
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="price-text text-base leading-tight">
          {product.price.toLocaleString('ru-RU')} ₽
        </p>
        <p className="text-text-secondary text-sm mt-0.5 leading-snug line-clamp-2">
          {product.name}
        </p>
      </div>
    </button>
  )
}
