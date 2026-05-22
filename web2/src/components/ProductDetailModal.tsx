'use client'

import Image from 'next/image'
import { Product } from '@/types'
import { Lang, t } from '@/i18n'

interface Props {
  product: Product
  lang: Lang
  isFav: boolean
  onToggleFav: () => void
  onClose: () => void
}

const SELLER = process.env.NEXT_PUBLIC_SELLER_USERNAME ?? 'dollordol'

export function ProductDetailModal({ product, lang, isFav, onToggleFav, onClose }: Props) {
  const handleWrite = () => {
    window.Telegram?.WebApp?.openTelegramLink(`https://t.me/${SELLER}`)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg animate-fade-in" style={{ overscrollBehavior: 'contain' }}>
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 w-9 h-9 flex items-center justify-center text-white bg-black/60 backdrop-blur-sm rounded-full border border-border"
      >
        ✕
      </button>

      <div className="flex-1 overflow-y-auto pb-6">
        <div className="relative w-full aspect-[3/4] bg-bg-3">
          <Image src={product.photoUrl} alt={product.name} fill className="object-cover" unoptimized priority />
        </div>

        <div className="px-4 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="price-text text-2xl">{product.price.toLocaleString('ru-RU')} ₽</span>
            <button
              onClick={onToggleFav}
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all active:scale-110 ${
                isFav ? 'bg-white text-black border-white' : 'bg-transparent text-white border-border'
              }`}
            >
              {isFav ? '♥' : '♡'}
            </button>
          </div>

          <h2 className="text-xl font-semibold text-white leading-tight mb-4">{product.name}</h2>

          {product.sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {product.sizes.map((size) => (
                <span key={size} className="size-badge selected px-3 py-1.5">{size}</span>
              ))}
            </div>
          )}

          <button onClick={handleWrite} className="btn-primary w-full py-3 text-center mb-4">
            {t(lang, 'write')} →
          </button>

          <p className="text-text-muted text-xs uppercase tracking-widest">
            {t(lang, `category_${product.category}` as any)}
          </p>
        </div>
      </div>
    </div>
  )
}
