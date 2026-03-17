import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

export async function POST(req: NextRequest) {
  try {
    const { email, turnstileToken } = await req.json()
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

    // Rate limit
    const limit = await rateLimit('forgot-password', ip)
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests. Try again in 15 minutes.' }, { status: 429 })
    }

    // Bot check
    const human = await verifyTurnstile(turnstileToken)
    if (!human) {
      return NextResponse.json({ error: 'Bot verification failed.' }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 })
    }

    const user = await db.user.findUnique({ where: { email } })

    // Always return success — don't reveal if email exists
    if (user && user.password) {
      // Invalidate any existing tokens
      await db.passwordResetToken.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      })

      const token = await db.passwordResetToken.create({
        data: {
          userId: user.id,
          expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        },
      })

      await sendPasswordResetEmail(email, token.token)
    }

    return NextResponse.json({ message: 'If an account exists, a reset link has been sent.' })
  } catch (err) {
    console.error('[forgot-password]', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
