import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BIIRZHA',
  description: 'Reseller catalog',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <head>
        {/* Telegram Mini App SDK */}
        <script src="https://telegram.org/js/telegram-web-app.js" async />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      </head>
      <body>{children}</body>
    </html>
  )
}
