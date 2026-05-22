'use client'

import { Category, Lang } from '@/types'
import { t } from '@/i18n'

type CatOption = Category | 'ALL'
const CATEGORIES: CatOption[] = ['ALL', 'PANTS', 'BAGS', 'JACKETS', 'HOODIES', 'TEES']

interface Props {
  active: CatOption
  lang: Lang
  onFiltersClick: () => void
  onCategoryChange: (cat: CatOption) => void
}

function catLabel(lang: Lang, cat: CatOption): string {
  const map: Record<CatOption, string> = {
    ALL: t(lang, 'all'),
    PANTS: t(lang, 'pants'),
    BAGS: t(lang, 'bags'),
    JACKETS: t(lang, 'jackets'),
    HOODIES: t(lang, 'hoodies'),
    TEES: t(lang, 'tees'),
  }
  return map[cat]
}

export function CategoryBar({ active, lang, onFiltersClick, onCategoryChange }: Props) {
  return (
    <div className="flex items-center gap-2 px-3 py-3 overflow-x-auto border-b border-border bg-bg">
      {/* Filters pill */}
      <button
        onClick={onFiltersClick}
        className="cat-pill shrink-0 flex items-center gap-1"
      >
        ≡ {t(lang, 'filters')}
      </button>

      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`cat-pill shrink-0 ${active === cat ? 'active' : ''}`}
        >
          {catLabel(lang, cat)}
        </button>
      ))}
    </div>
  )
}
