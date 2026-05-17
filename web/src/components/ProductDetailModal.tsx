'use client'

import Image from 'next/image'
import { Product, Lang } from '@/types'
import { t } from '@/i18n'

interface Props {
  product: Product
  lang: Lang
  isFav: boolean
  onToggleFav: () => void
  onClose: () => void
}

const SELLER = process.env.NEXT_PUBLIC_SELLER_USERNAME ?? 'dollordol'

export function ProductDetailModal({
  product,
  lang,
  isFav,
  onToggleFav,
  onClose,
}: Props) {
  const name = lang === 'ru' ? product.nameRu : product.nameEn

  const handleWrite = () => {
    window.Telegram?.WebApp?.openTelegramLink(`https://t.me/${SELLER}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg animate-fade-in"
      style={{ overscrollBehavior: 'contain' }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-8 h-8 flex items-center justify-center text-text-secondary text-xl bg-bg/70 backdrop-blur-sm rounded-sm border border-border"
      >
        ✕
      </button>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Photo */}
        <div className="relative w-full aspect-[3/4] bg-bg-3">
          <Image
            src={product.photoUrl}
            alt={name}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        <div className="px-4 pt-4">
          {/* Price + Fav row */}
          <div className="flex items-center justify-between mb-2">
            <span className="price-text text-2xl font-bold">
              {product.price.toLocaleString('ru-RU')}₽
            </span>
            <button
              onClick={onToggleFav}
              className={`text-2xl transition-all duration-150 active:scale-110 ${
                isFav ? 'text-red-main drop-shadow-md' : 'text-text-muted'
              }`}
              aria-label={t(lang, isFav ? 'favorites' : 'favorites')}
            >
              {isFav ? '♥' : '♡'}
            </button>
          </div>

          {/* Name */}
          <h2 className="font-display text-2xl text-text-primary tracking-widest uppercase leading-tight mb-4">
            {name}
          </h2>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.sizes.map((size) => (
                <span key={size} className="size-badge selected px-3 py-1 rounded-sm">
                  {size}
                </span>
              ))}
            </div>
          )}

          {/* Write button */}
          <button
            onClick={handleWrite}
            className="btn-red w-full py-3 rounded-sm text-center mb-4"
          >
            {t(lang, 'write')} →
          </button>

          {/* Category tag */}
          <p className="text-text-muted text-xs font-mono uppercase tracking-widest">
            {t(lang, `category_${product.category}` as any)}
          </p>
        </div>
      </div>
    </div>
  )
}
