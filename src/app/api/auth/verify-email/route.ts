import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) {
    return NextResponse.redirect(new URL('/auth/verify-email?error=missing', req.url))
  }

  const record = await db.emailVerificationToken.findUnique({ where: { token } })

  if (!record) {
    return NextResponse.redirect(new URL('/auth/verify-email?error=invalid', req.url))
  }
  if (record.expires < new Date()) {
    return NextResponse.redirect(new URL('/auth/verify-email?error=expired', req.url))
  }

  // Mark email as verified and delete token
  await db.user.update({
    where: { id: record.userId },
    data: { emailVerified: new Date() },
  })
  await db.emailVerificationToken.delete({ where: { token } })

  return NextResponse.redirect(new URL('/auth/verify-email?success=true', req.url))
}
