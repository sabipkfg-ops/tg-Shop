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
  const handleWrite = () => {
    window.Telegram?.WebApp?.openTelegramLink(`https://t.me/${SELLER}`)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col bg-bg animate-fade-in web2000-page"
      style={{ overscrollBehavior: 'contain' }}
    >
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 web2000-button px-2 py-1 text-lg"
        aria-label="Close"
      >
        X
      </button>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative w-full aspect-[3/4] bg-bg-3 web2000-panel">
          <Image
            src={product.photoUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
            priority
          />
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="price-text text-2xl font-bold">
              {product.price.toLocaleString('ru-RU')} {'\u20BD'}
            </span>
            <button
              onClick={onToggleFav}
              className="favorite-button w-11 h-11 flex items-center justify-center transition-all duration-150 active:scale-110"
              aria-label={t(lang, 'favorites')}
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

          <h2 className="font-display text-3xl text-text-primary tracking-widest uppercase leading-tight mb-4 web2000-title">
            {product.name}
          </h2>

          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.sizes.map((size) => (
                <span key={size} className="size-badge selected px-3 py-1 rounded-sm">
                  {size}
                </span>
              ))}
            </div>
          )}

          <button
            onClick={handleWrite}
            className="btn-red w-full py-3 rounded-sm text-center mb-4"
          >
            {t(lang, 'write')} &gt;&gt;
          </button>

          <p className="text-text-muted text-xs font-mono uppercase tracking-widest">
            {t(lang, `category_${product.category}` as any)}
          </p>
        </div>
      </div>
    </div>
  )
}
