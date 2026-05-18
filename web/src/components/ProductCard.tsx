'use client'

import Image from 'next/image'
import { Product,  Lang } from '@/types'
import { t } from '@/i18n'

interface Props {
  product: Product
  lang: Lang
  isFav: boolean
  onClick: () => void
}

export function ProductCard({ product, lang, isFav, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="glitch-card border-distress rounded-sm bg-bg-2 w-full text-left active:scale-[0.97] transition-transform duration-100"
    >
      {/* Photo */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-bg-3">
        <Image
          src={product.photoUrl}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 33vw"
          unoptimized
        />
        {isFav && (
          <span className="absolute top-2 right-2 text-red-main text-lg leading-none drop-shadow-md">
            ♥
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-2 pb-3">
        <p className="price-text text-base font-bold leading-tight">
          {product.price.toLocaleString('ru-RU')}₽
        </p>
        <p className="text-text-primary text-sm mt-0.5 leading-snug line-clamp-2 font-display tracking-wide">
          {lang === 'ru' ? product.name : product.name}
        </p>
      </div>
    </button>
  )
}
