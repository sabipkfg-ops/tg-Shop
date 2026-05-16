'use client'

import { Tab, Lang } from '@/types'
import { t } from '@/i18n'

interface Props {
  active: Tab
  lang: Lang
  onTabChange: (tab: Tab) => void
}

export function BottomNav({ active, lang, onTabChange }: Props) {
  return (
    <nav className="flex border-t border-border bg-bg-2 shrink-0">
      {(['catalog', 'favorites'] as Tab[]).map((tab) => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-colors ${
              isActive ? 'text-red-main' : 'text-text-muted'
            }`}
          >
            <span className="text-lg leading-none">
              {tab === 'catalog' ? '◫' : '♥'}
            </span>
            <span className="font-display text-xs tracking-widest uppercase">
              {t(lang, tab === 'catalog' ? 'catalog' : 'favorites')}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
