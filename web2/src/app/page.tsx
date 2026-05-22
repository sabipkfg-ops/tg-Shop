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
  const { telegramId, ready } = useTelegram()
  const { favorites, ids, fetch, toggle } = useFavoritesStore()

  useEffect(() => {
    if (telegramId) fetch(telegramId)
  }, [telegramId, fetch])

  if (!ready) {
    return (
      <div className="flex items-center justify-center h-screen bg-bg">
        <span className="text-white text-3xl font-bold tracking-widest">GRAIL</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-bg overflow-hidden">
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg shrink-0">
        <span className="text-white text-xl font-bold tracking-widest">GRAIL</span>
        <button
          onClick={() => setLang((l) => (l === 'ru' ? 'en' : 'ru'))}
          className="text-xs font-medium tracking-widest uppercase border border-border text-text-secondary px-2 py-1 rounded-lg transition-colors hover:border-white hover:text-white"
        >
          {lang === 'ru' ? 'EN' : 'RU'}
        </button>
      </header>

      <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
        {tab === 'catalog' ? (
          <CatalogTab lang={lang} telegramId={telegramId} favIds={ids}
            onToggleFav={(product) => telegramId && toggle(telegramId, product)} />
        ) : (
          <FavoritesTab lang={lang} products={favorites} telegramId={telegramId} favIds={ids}
            onToggleFav={(product) => telegramId && toggle(telegramId, product)} />
        )}
      </div>

      <BottomNav active={tab} lang={lang} onTabChange={setTab} />
    </div>
  )
}
