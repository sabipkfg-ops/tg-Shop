'use client'

import { useState } from 'react'
import { Filters, SortOrder, Lang } from '@/types'
import { t } from '@/i18n'

interface Props {
  initial: Filters
  lang: Lang
  onApply: (filters: Filters) => void
  onClose: () => void
}

const CLOTHING = ['XS', 'S', 'M', 'L', 'XL']
const SHOES = Array.from({ length: 10 }, (_, i) => String(36 + i))
const PANTS = [
  '28/30', '28/32', '30/30', '30/32', '30/34',
  '32/30', '32/32', '32/34', '34/30', '34/32',
  '34/34', '36/30', '36/32', '36/34', '38/32', '38/34',
]

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]
}

export function FilterModal({ initial, lang, onApply, onClose }: Props) {
  const [clothing, setClothing] = useState<string[]>(initial.clothingSizes)
  const [shoes, setShoes] = useState<string[]>(initial.shoeSizes)
  const [sort, setSort] = useState<SortOrder>(initial.sort)

  const reset = () => {
    setClothing([])
    setShoes([])
    setSort('asc')
  }

  const apply = () => {
    onApply({ clothingSizes: clothing, shoeSizes: shoes, sort })
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="web2000-panel fixed bottom-0 left-0 right-0 z-50 bg-bg-2 border-t border-border rounded-t-lg animate-slide-up pb-safe">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>

        <div className="px-4 pb-6 max-h-[75vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between py-3 mb-2">
            <h3 className="font-display text-xl tracking-widest text-text-primary uppercase">
              {t(lang, 'filters')}
            </h3>
            <button
              onClick={reset}
              className="text-text-secondary text-xs font-mono uppercase tracking-widest"
            >
              {t(lang, 'reset')}
            </button>
          </div>

          {/* Clothing sizes */}
          <Section label={t(lang, 'clothingSize')}>
            <div className="flex flex-wrap gap-2">
              {CLOTHING.map((s) => (
                <SizeBtn
                  key={s}
                  size={s}
                  selected={clothing.includes(s)}
                  onToggle={() => setClothing((p) => toggle(p, s))}
                />
              ))}
            </div>
          </Section>

          {/* Pants sizes */}
          <Section label={t(lang, 'pantsSize')}>
            <div className="flex flex-wrap gap-2">
              {PANTS.map((s) => (
                <SizeBtn
                  key={s}
                  size={s}
                  selected={clothing.includes(s)}
                  onToggle={() => setClothing((p) => toggle(p, s))}
                />
              ))}
            </div>
          </Section>

          {/* Shoe sizes */}
          <Section label={t(lang, 'shoeSize')}>
            <div className="flex flex-wrap gap-2">
              {SHOES.map((s) => (
                <SizeBtn
                  key={s}
                  size={s}
                  selected={shoes.includes(s)}
                  onToggle={() => setShoes((p) => toggle(p, s))}
                />
              ))}
            </div>
          </Section>

          {/* Sort */}
          <Section label={t(lang, 'sort')}>
            <div className="flex gap-2">
              {(['asc', 'desc'] as SortOrder[]).map((val) => (
                <button
                  key={val}
                  onClick={() => setSort(val)}
                  className={`flex-1 py-2 px-4 text-sm font-mono uppercase tracking-widest rounded-sm border transition-all ${
                    sort === val
                      ? 'border-red-main text-red-main bg-red-main/10'
                      : 'border-border text-text-secondary'
                  }`}
                >
                  {val === 'asc' ? t(lang, 'cheapFirst') : t(lang, 'expFirst')}
                </button>
              ))}
            </div>
          </Section>

          {/* Apply */}
          <button onClick={apply} className="btn-red w-full py-3 rounded-sm mt-4">
            {t(lang, 'apply')}
          </button>
        </div>
      </div>
    </>
  )
}

function Section({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <p className="text-text-secondary text-xs font-mono uppercase tracking-widest mb-3">
        {label}
      </p>
      {children}
    </div>
  )
}

function SizeBtn({
  size,
  selected,
  onToggle,
}: {
  size: string
  selected: boolean
  onToggle: () => void
}) {
  return (
    <button
      onClick={onToggle}
      className={`size-badge px-3 py-1.5 rounded-sm ${selected ? 'selected' : ''}`}
    >
      {size}
    </button>
  )
}
