import { db } from './db'

const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const MAX_ATTEMPTS: Record<string, number> = {
  login: 5,
  signup: 10,
  'forgot-password': 3,
  'reset-password': 5,
}

export async function rateLimit(action: string, identifier: string): Promise<{ ok: boolean; remaining: number }> {
  const key = `${action}:${identifier}`
  const max = MAX_ATTEMPTS[action] ?? 5
  const now = new Date()
  const resetAt = new Date(now.getTime() + WINDOW_MS)

  const record = await db.rateLimit.upsert({
    where: { key },
    update: {
      attempts: { increment: 1 },
      updatedAt: now,
    },
    create: { key, attempts: 1, resetAt },
  })

  // If window has expired, reset
  if (record.resetAt < now) {
    await db.rateLimit.update({
      where: { key },
      data: { attempts: 1, resetAt },
    })
    return { ok: true, remaining: max - 1 }
  }

  const remaining = Math.max(0, max - record.attempts)
  return { ok: record.attempts <= max, remaining }
}
