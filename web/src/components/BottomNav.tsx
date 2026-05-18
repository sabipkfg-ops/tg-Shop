'use client'

import Image from 'next/image'
import { Tab, Lang } from '@/types'
import { t } from '@/i18n'

interface Props {
  active: Tab
  lang: Lang
  onTabChange: (tab: Tab) => void
}

export function BottomNav({ active, lang, onTabChange }: Props) {
  return (
    <nav className="web2000-nav flex border-t border-border bg-bg-2 shrink-0">
      {(['catalog', 'favorites'] as Tab[]).map((tab) => {
        const isActive = active === tab
        return (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors ${
              isActive ? 'text-red-main' : 'text-text-muted'
            }`}
          >
            {tab === 'catalog' ? (
              <span className="web2000-catalog-icon" aria-hidden="true">[#]</span>
            ) : (
              <Image
                src={isActive ? '/assets/favorite-filled.svg' : '/assets/favorite-outline.svg'}
                alt=""
                width={18}
                height={22}
                className="favorite-icon nav-favorite-icon"
                unoptimized
              />
            )}
            <span className="font-display text-xs tracking-widest uppercase">
              {t(lang, tab === 'catalog' ? 'catalog' : 'favorites')}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
