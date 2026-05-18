'use client'

import { useEffect, useState } from 'react'
import { Tab, Lang } from '@/types'
import { useTelegram } from '@/hooks/useTelegram'
import { useFavoritesStore } from '@/store/favoritesStore'
import { BottomNav } from '@/components/BottomNav'
import { CatalogTab } from '@/components/CatalogTab'
import { FavoritesTab } from '@/components/FavoritesTab'

export default function App() {
  const [tab, setTab] = useState<Tab>('catalog')
  const [lang, setLang] = useState<Lang>('ru')
  const { user, telegramId, ready } = useTelegram()

  const { favorites, ids, fetch, toggle } = useFavoritesStore()

  // Load favorites once Telegram user is known
  useEffect(() => {
    if (telegramId) fetch(telegramId)
  }, [telegramId, fetch])

  if (!ready) {
    return (
      <div className="web2000-page flex items-center justify-center h-screen">
        <span className="web2000-title font-display text-4xl tracking-widest text-red-main animate-pulse">
          BIIRZHA
        </span>
      </div>
    )
  }

  return (
    <div className="web2000-page flex flex-col h-screen overflow-hidden">
      <header className="web2000-header shrink-0">
        <div className="flex items-center justify-between gap-3 px-3 py-2">
          <div className="min-w-0">
            <p className="web2000-kicker font-mono text-[10px] uppercase">
              The world&apos;s most wanted website
            </p>
            <h1 className="web2000-title font-display text-4xl tracking-widest text-text-primary leading-none">
              BIIRZHA
            </h1>
          </div>
          <button
            onClick={() => setLang((l) => (l === 'ru' ? 'en' : 'ru'))}
            className="web2000-button font-mono text-xs tracking-widest uppercase px-3 py-2"
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>
        </div>
        <div className="web2000-marquee font-mono text-[10px] uppercase">
          <span>COMING SOON: new drops /// rare archive /// best prices /// CLICK CATALOG</span>
        </div>
      </header>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {tab === 'catalog' ? (
          <CatalogTab
            lang={lang}
            telegramId={telegramId}
            favIds={ids}
            onToggleFav={(product) => telegramId && toggle(telegramId, product)}
          />
        ) : (
          <FavoritesTab
            lang={lang}
            products={favorites}
            telegramId={telegramId}
            favIds={ids}
            onToggleFav={(product) => telegramId && toggle(telegramId, product)}
          />
        )}
      </div>

      <BottomNav active={tab} lang={lang} onTabChange={setTab} />
    </div>
  )
}
