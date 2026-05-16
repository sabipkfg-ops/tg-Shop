'use client'

import { useEffect, useState } from 'react'

interface TgUser {
  id: number
  username?: string
  first_name: string
}

export function useTelegram() {
  const [user, setUser] = useState<TgUser | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const tg = window.Telegram?.WebApp
    if (tg) {
      tg.ready()
      tg.expand()
      setUser(tg.initDataUnsafe?.user ?? null)
    }
    setReady(true)
  }, [])

  const haptic = (style: 'light' | 'medium' | 'heavy' = 'light') => {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style)
  }

  const openChat = (username: string) => {
    window.Telegram?.WebApp?.openTelegramLink(`https://t.me/${username}`)
  }

  return {
    user,
    ready,
    telegramId: user?.id?.toString() ?? null,
    haptic,
    openChat,
  }
}
