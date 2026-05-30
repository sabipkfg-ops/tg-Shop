import type { Response } from 'express'

const TG_PREFIX = 'tg:'

function botTokens(): string[] {
  return [process.env.BOT_TOKEN, process.env.BOT_TOKEN_2].filter(Boolean) as string[]
}

export function storedPhotoFromFileId(fileId: string): string {
  return `${TG_PREFIX}${fileId}`
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

async function getFilePath(token: string, fileId: string): Promise<string | null> {
  const res = await fetch(
    `https://api.telegram.org/bot${token}/getFile?file_id=${encodeURIComponent(fileId)}`
  )
  if (!res.ok) return null
  const data = (await res.json()) as { ok: boolean; result?: { file_path: string } }
  if (!data.ok || !data.result?.file_path) return null
  return data.result.file_path
}

function extractFilePathFromTelegramUrl(url: string): string | null {
  const match = url.match(/\/file\/bot[^/]+\/(.+)$/)
  return match ? match[1] : null
}

async function downloadTelegramFile(token: string, filePath: string): Promise<Buffer | null> {
  const res = await fetch(`https://api.telegram.org/file/bot${token}/${filePath}`)
  if (!res.ok) return null
  return Buffer.from(await res.arrayBuffer())
}

async function downloadStoredPhoto(stored: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const tokens = botTokens()
  if (!tokens.length) return null

  if (stored.startsWith('http')) {
    try {
      const res = await fetch(stored)
      if (res.ok) {
        return {
          buffer: Buffer.from(await res.arrayBuffer()),
          contentType: res.headers.get('content-type') ?? 'image/jpeg',
        }
      }
    } catch {
      /* try fallbacks below */
    }
  }

  const filePaths = new Set<string>()
  if (stored.startsWith(TG_PREFIX)) {
    const fileId = stored.slice(TG_PREFIX.length)
    for (const token of tokens) {
      const path = await getFilePath(token, fileId)
      if (path) filePaths.add(path)
    }
  } else if (stored.includes('api.telegram.org/file/bot')) {
    const path = extractFilePathFromTelegramUrl(stored)
    if (path) filePaths.add(path)
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
