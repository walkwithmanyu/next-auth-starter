'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token') ?? ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <div className="text-center">
        <h1 className="text-xl font-semibold text-black">Invalid link</h1>
        <p className="mt-2 text-sm text-black/50">This password reset link is invalid.</p>
        <Link href="/auth/forgot-password" className="mt-4 block text-sm text-black underline">
          Request a new one
        </Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password !== confirm) return setError('Passwords do not match.')
    if (password.length < 8) return setError('Password must be at least 8 characters.')

    setLoading(true)
    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error)
    router.push('/login?reset=success')
  }

  return (
    <div className="w-full max-w-sm border border-black/10 p-10">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-black">New password</h1>
        <p className="mt-1 text-sm text-black/50">Choose a strong password for your account.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          required
          className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
        />

        {error && <p className="text-xs text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
        >
          {loading ? 'Updating…' : 'Update password'}
        </button>
      </form>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </main>
  )
}
