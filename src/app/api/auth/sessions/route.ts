import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { db } from '@/lib/db'

// GET — list all sessions for current user
export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const sessions = await db.session.findMany({
    where: { userId: session.user.id },
    orderBy: { expires: 'desc' },
    select: { id: true, expires: true, userAgent: true, ipAddress: true },
  })

  return NextResponse.json({ sessions })
}

// DELETE — revoke a specific session
export async function DELETE(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { sessionId } = await req.json()

  // Only allow deleting own sessions
  const target = await db.session.findFirst({
    where: { id: sessionId, userId: session.user.id },
  })

  if (!target) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  await db.session.delete({ where: { id: sessionId } })

  return NextResponse.json({ message: 'Session revoked' })
}
