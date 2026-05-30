import type { Response } from 'express'

const TG_PREFIX = 'tg:'

function botTokens(): string[] {
  return [process.env.BOT_TOKEN, process.env.BOT_TOKEN_2].filter(Boolean) as string[]
}

function tokenForBotKey(botKey: string): string | null {
  if (botKey === '1') return process.env.BOT_TOKEN ?? null
  if (botKey === '2') return process.env.BOT_TOKEN_2 ?? null
  return null
}

export function storedPhotoFromFileId(fileId: string, botKey = '0'): string {
  return `${TG_PREFIX}${botKey}:${fileId}`
}

export function publicProductPhotoUrl(productId: number): string {
  const base = (process.env.API_PUBLIC_URL ?? process.env.SERVER_URL ?? 'http://localhost:3001').replace(
    /\/$/,
    ''
  )
  return `${base}/api/products/${productId}/photo`
}

export function mapProductForClient<P extends { id: number }>(product: P): P & { photoUrl: string } {
  return { ...product, photoUrl: publicProductPhotoUrl(product.id) }
}

const TG_FETCH_HEADERS = { 'User-Agent': 'TgShop/1.0' }

function pathVariants(filePath: string): string[] {
  const variants = new Set<string>([filePath])
  try {
    variants.add(decodeURIComponent(filePath))
  } catch {
    /* ignore */
  }
  return [...variants]
}

function extractFilePathFromTelegramUrl(url: string): string | null {
  const match = url.match(/\/file\/bot[^/]+\/(.+?)(?:\?|$)/)
  return match ? match[1] : null
}

function parseTelegramRef(stored: string): { botKey: string; fileId: string } | null {
  if (!stored.startsWith(TG_PREFIX)) return null
  const payload = stored.slice(TG_PREFIX.length)
  const colon = payload.indexOf(':')
  if (colon === -1) return { botKey: '0', fileId: payload }
  const botKey = payload.slice(0, colon)
  const fileId = payload.slice(colon + 1)
  if (!fileId) return null
  return { botKey, fileId }
}

async function getFilePath(token: string, fileId: string): Promise<string | null> {
  const res = await fetch(
    `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`,
    { headers: TG_FETCH_HEADERS }
  )
  if (!res.ok) return null
  const data = (await res.json()) as { ok: boolean; result?: { file_path: string } }
  if (!data.ok || !data.result?.file_path) return null
  return data.result.file_path
}

async function downloadTelegramFile(token: string, filePath: string): Promise<Buffer | null> {
  for (const variant of pathVariants(filePath)) {
    const res = await fetch(`https://api.telegram.org/file/bot${token}/${variant}`, {
      headers: TG_FETCH_HEADERS,
    })
    if (res.ok) return Buffer.from(await res.arrayBuffer())
  }
  return null
}

function tokensForBotKey(botKey: string): string[] {
  if (botKey === '1' || botKey === '2') {
    const token = tokenForBotKey(botKey)
    return token ? [token] : []
  }
  return botTokens()
}

async function downloadStoredPhoto(stored: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const tokens = botTokens()
  if (!tokens.length) {
    console.error('[photo] BOT_TOKEN / BOT_TOKEN_2 not configured')
    return null
  }

  const filePaths = new Set<string>()

  const tgRef = parseTelegramRef(stored)
  if (tgRef) {
    for (const token of tokensForBotKey(tgRef.botKey)) {
      const path = await getFilePath(token, tgRef.fileId)
      if (path) filePaths.add(path)
    }
  }

  if (stored.includes('api.telegram.org/file/bot')) {
    const path = extractFilePathFromTelegramUrl(stored)
    if (path) filePaths.add(path)
  } else if (!stored.startsWith('http') && !stored.startsWith(TG_PREFIX) && stored.includes('/')) {
    filePaths.add(stored)
  }

  for (const filePath of filePaths) {
    for (const token of tokens) {
      const buffer = await downloadTelegramFile(token, filePath)
      if (buffer) {
        const ext = filePath.split('.').pop()?.toLowerCase()
        const contentType =
          ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : 'image/jpeg'
        return { buffer, contentType }
      }
    }
  }

  if (stored.startsWith('http') && !stored.includes('/api/products/')) {
    try {
      const res = await fetch(stored, { headers: TG_FETCH_HEADERS })
      if (res.ok) {
        return {
          buffer: Buffer.from(await res.arrayBuffer()),
          contentType: res.headers.get('content-type') ?? 'image/jpeg',
        }
      }
    } catch (e) {
      console.error('[photo] direct URL fetch failed:', (e as Error).message)
    }
  }

  console.error('[photo] could not load:', stored.slice(0, 80))
  return null
}

export async function sendProductPhoto(stored: string, res: Response): Promise<boolean> {
  const file = await downloadStoredPhoto(stored)
  if (!file) return false

  res.setHeader('Content-Type', file.contentType)
  res.setHeader('Cache-Control', 'public, max-age=86400')
  res.send(file.buffer)
  return true
}

export async function checkTelegramBots(): Promise<
  { name: string; configured: boolean; ok: boolean; username?: string; error?: string }[]
> {
  const checks = [
    { name: 'bot1', token: process.env.BOT_TOKEN },
    { name: 'bot2', token: process.env.BOT_TOKEN_2 },
  ]

  const results = []
  for (const { name, token } of checks) {
    if (!token) {
      results.push({ name, configured: false, ok: false, error: 'missing env' })
      continue
    }
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/getMe`, {
        headers: TG_FETCH_HEADERS,
      })
      const data = (await res.json()) as { ok: boolean; result?: { username?: string }; description?: string }
      results.push({
        name,
        configured: true,
        ok: data.ok,
        username: data.result?.username,
        error: data.ok ? undefined : data.description,
      })
    } catch (e) {
      results.push({ name, configured: true, ok: false, error: (e as Error).message })
    }
  }
  return results
}
