'use client'

import { useState, useCallback } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import TurnstileWidget from './TurnstileWidget'

export default function EmailSignInForm() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [turnstileToken, setTurnstileToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleTurnstile = useCallback((token: string) => setTurnstileToken(token), [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      turnstileToken,
      redirect: false,
    })

    setLoading(false)

    if (result?.error) {
      setError('Invalid email or password, or email not verified.')
      return
    }

    window.location.href = '/'
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <input
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
        required
        className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
      />
      <div className="relative">
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
          required
          className="w-full border border-black/15 px-4 py-3 text-sm text-black outline-none placeholder:text-black/30 focus:border-black"
        />
        <Link
          href="/auth/forgot-password"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-black/40 hover:text-black"
        >
          Forgot?
        </Link>
      </div>

      <TurnstileWidget onVerify={handleTurnstile} />

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-black bg-black px-4 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:opacity-50"
      >
        {loading ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  )
}
