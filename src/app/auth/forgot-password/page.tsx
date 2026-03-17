'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import TurnstileWidget from '@/components/auth/TurnstileWidget'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [turnstileToken, setTurnstileToken] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleTurnstile = useCallback((token: string) => setTurnstileToken(token), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, turnstileToken }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-sm border border-black/10 p-10 text-center">
          <h1 className="text-xl font-semibold text-black">Check your email</h1>
          <p className="mt-2 text-sm text-black/50">
            If an account exists for <strong>{email}</strong>, we sent a password reset link.
          </p>
          <Link href="/login" className="mt-6 block text-sm text-black underline">
            Back to sign in
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-black/10 p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-black">Forgot password</h1>
          <p className="mt-1 text-sm text-black/50">
            Enter your email and we&apos;ll send a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
          />

          <TurnstileWidget onVerify={handleTurnstile} />

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <Link href="/login" className="mt-6 block text-center text-sm text-black/50 underline">
          Back to sign in
        </Link>
      </div>
    </main>
  )
}
