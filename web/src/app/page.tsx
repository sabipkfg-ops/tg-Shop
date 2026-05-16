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
      <div className="flex items-center justify-center h-screen bg-bg">
        <span className="font-display text-3xl tracking-widest text-red-main animate-pulse">
          DRIP STORE
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-bg-2 shrink-0">
        <span className="font-display text-2xl tracking-widest text-text-primary">
          DRIP<span className="text-red-main">.</span>STORE
        </span>
        {/* Language switcher */}
        <button
          onClick={() => setLang((l) => (l === 'ru' ? 'en' : 'ru'))}
          className="font-mono text-xs tracking-widest uppercase border border-border text-text-secondary px-2 py-1 rounded-sm transition-colors hover:border-red-main hover:text-red-main"
        >
          {lang === 'ru' ? 'EN' : 'RU'}
        </button>
      </header>

      {/* Tab content */}
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

      {/* Bottom navigation */}
      <BottomNav active={tab} lang={lang} onTabChange={setTab} />
    </div>
  )
}
