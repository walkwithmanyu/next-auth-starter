import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { rateLimit } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json()
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'

    const limit = await rateLimit('reset-password', ip)
    if (!limit.ok) {
      return NextResponse.json({ error: 'Too many requests. Try again in 15 minutes.' }, { status: 429 })
    }

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required.' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 })
    }

    const record = await db.passwordResetToken.findUnique({ where: { token } })

    if (!record || record.used) {
      return NextResponse.json({ error: 'Invalid or expired reset link.' }, { status: 400 })
    }
    if (record.expires < new Date()) {
      return NextResponse.json({ error: 'This reset link has expired. Request a new one.' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await db.user.update({
      where: { id: record.userId },
      data: { password: hashed },
    })

    await db.passwordResetToken.update({
      where: { token },
      data: { used: true },
    })

    return NextResponse.json({ message: 'Password updated successfully.' })
  } catch (err) {
    console.error('[reset-password]', err)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}
