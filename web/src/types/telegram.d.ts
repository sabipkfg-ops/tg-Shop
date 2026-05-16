interface TelegramWebApp {
  ready: () => void
  expand: () => void
  close: () => void
  initDataUnsafe: {
    user?: {
      id: number
      username?: string
      first_name: string
      last_name?: string
    }
  }
  openTelegramLink: (url: string) => void
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void
  }
  colorScheme: 'light' | 'dark'
  themeParams: Record<string, string>
}

interface Window {
  Telegram?: {
    WebApp: TelegramWebApp
  }
}
