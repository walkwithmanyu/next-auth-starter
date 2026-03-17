import { auth, signOut } from '@/lib/auth'
import { redirect } from 'next/navigation'

export default async function HomePage() {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-black">WePegasus</h1>
        <p className="mt-2 text-sm text-black/50">
          Signed in as {session.user?.name} ({session.user?.email})
        </p>
        <form
          action={async () => {
            'use server'
            await signOut({ redirectTo: '/login' })
          }}
          className="mt-6"
        >
          <button
            type="submit"
            className="border border-black/15 px-5 py-2 text-sm font-medium text-black transition hover:bg-black/5"
          >
            Sign out
          </button>
        </form>
      </div>
    </main>
  )
}
