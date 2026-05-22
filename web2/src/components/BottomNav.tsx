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
    <nav className="flex border-t border-border bg-bg shrink-0">
      {(['catalog', 'favorites'] as Tab[]).map((tab) => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
              isActive ? 'text-white' : 'text-text-muted'
            }`}
          >
            <span className="text-xl leading-none">
              {tab === 'catalog' ? '⊞' : '♡'}
            </span>
            <span className="text-xs font-medium uppercase tracking-widest">
              {t(lang, tab === 'catalog' ? 'catalog' : 'favorites')}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
