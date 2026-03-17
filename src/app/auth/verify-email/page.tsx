import Link from 'next/link'

interface Props {
  searchParams: Promise<{ success?: string; error?: string }>
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const params = await searchParams
  const { success, error } = params

  const messages: Record<string, string> = {
    missing: 'Invalid verification link.',
    invalid: 'This verification link is invalid or has already been used.',
    expired: 'This verification link has expired. Sign up again to get a new one.',
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-sm border border-black/10 p-10 text-center">
          <h1 className="text-xl font-semibold text-black">Email verified</h1>
          <p className="mt-2 text-sm text-black/50">Your account is active. You can now sign in.</p>
          <Link
            href="/login"
            className="mt-6 inline-block border border-black bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black/80"
          >
            Sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-black/10 p-10 text-center">
        <h1 className="text-xl font-semibold text-black">
          {error ? 'Verification failed' : 'Verify your email'}
        </h1>
        <p className="mt-2 text-sm text-black/50">
          {error
            ? messages[error] ?? 'Something went wrong.'
            : 'Check your inbox for a verification link.'}
        </p>
        <Link href="/login" className="mt-6 block text-sm text-black underline">
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
