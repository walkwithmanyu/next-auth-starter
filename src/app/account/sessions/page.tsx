import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import RevokeSessionButton from './RevokeSessionButton'

export default async function SessionsPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const sessions = await db.session.findMany({
    where: { userId: session.user.id },
    orderBy: { expires: 'desc' },
  })

  return (
    <main className="min-h-screen bg-white px-6 py-16">
      <div className="mx-auto max-w-xl">
        <h1 className="text-xl font-semibold text-black">Active sessions</h1>
        <p className="mt-1 text-sm text-black/50">
          These are all devices currently signed in to your account.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {sessions.length === 0 && (
            <p className="text-sm text-black/40">No active sessions found.</p>
          )}
          {sessions.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between border border-black/10 px-4 py-3"
            >
              <div>
                <p className="text-sm text-black">
                  {s.userAgent ?? 'Unknown device'}
                </p>
                <p className="mt-0.5 text-xs text-black/40">
                  {s.ipAddress ?? 'Unknown IP'} · Expires{' '}
                  {new Date(s.expires).toLocaleDateString()}
                </p>
              </div>
              <RevokeSessionButton sessionId={s.id} />
            </div>
          ))}
        </div>

        <Link href="/" className="mt-8 block text-sm text-black/40 underline">
          Back to home
        </Link>
      </div>
    </main>
  )
}
