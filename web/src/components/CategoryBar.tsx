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
    <div className="flex items-center gap-0 border-b border-border bg-bg-2 overflow-x-auto no-scrollbar">
      {/* Filters button */}
      <button
        onClick={onFiltersClick}
        className="shrink-0 px-4 py-3 text-xs font-mono uppercase tracking-widest text-text-secondary border-r border-border hover:text-red-main transition-colors"
      >
        ⊞ {t(lang, 'filters')}
      </button>
 
      {/* Category chips */}
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`cat-chip shrink-0 px-4 py-3 text-sm whitespace-nowrap ${
            active === cat ? 'active text-red-main' : 'text-text-secondary'
          }`}
        >
          {catLabel(lang, cat)}
        </button>
      ))}
    </div>
  )
}
