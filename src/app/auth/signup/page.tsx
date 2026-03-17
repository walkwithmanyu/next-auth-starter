'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import TurnstileWidget from '@/components/auth/TurnstileWidget'

export default function SignUpPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [turnstileToken, setTurnstileToken] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleTurnstile = useCallback((token: string) => setTurnstileToken(token), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirm) {
      setError('Passwords do not match.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        turnstileToken,
      }),
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error)
    setSuccess(true)
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="w-full max-w-sm border border-black/10 p-10 text-center">
          <h1 className="text-xl font-semibold text-black">Check your email</h1>
          <p className="mt-2 text-sm text-black/50">
            We sent a verification link to <strong>{form.email}</strong>.
            Click it to activate your account.
          </p>
          <p className="mt-3 text-xs text-black/30">
            (No email client set up? Check the server terminal for the link.)
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
          <h1 className="text-2xl font-semibold tracking-tight text-black">Create account</h1>
          <p className="mt-1 text-sm text-black/50">
            Already have one?{' '}
            <Link href="/login" className="text-black underline">Sign in</Link>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            required
            className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
          />
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
          />
          <input
            type="password"
            placeholder="Password (min 8 characters)"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            required
            className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
          />
          <input
            type="password"
            placeholder="Confirm password"
            value={form.confirm}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            required
            className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
          />

          <TurnstileWidget onVerify={handleTurnstile} />

          {error && (
            <p className="border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create account'}
          </button>
        </form>
      </div>
    </main>
  )
}
