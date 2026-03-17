import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { sendVerificationEmail } from '@/lib/email'
import { rateLimit } from '@/lib/rate-limit'
import { verifyTurnstile } from '@/lib/turnstile'

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, turnstileToken } = await req.json()
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

    // Rate limit
    const limit = await rateLimit('signup', ip)
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests. Try again in 15 minutes.' }, { status: 429 })
    }

    // Bot check
    const human = await verifyTurnstile(turnstileToken)
    if (!human) {
      return NextResponse.json({ error: 'Bot verification failed.' }, { status: 400 })
    }

    // Validate
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    // Check existing
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 409 })
    }

    // Create user
    const hashed = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: { name, email, password: hashed },
    })

    // Create verification token (expires in 24h)
    const token = await db.emailVerificationToken.create({
      data: {
        userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    })

    await sendVerificationEmail(email, token.token)

    return NextResponse.json({ message: 'Account created. Check your email to verify.' }, { status: 201 })
  } catch (err) {
    console.error('[signup]', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
