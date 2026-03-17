'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RevokeSessionButton({ sessionId }: { sessionId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function revoke() {
    setLoading(true)
    await fetch('/api/auth/sessions', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={revoke}
      disabled={loading}
      className="text-xs text-black/40 underline hover:text-red-600 disabled:opacity-50"
    >
      {loading ? 'Revoking…' : 'Revoke'}
    </button>
  )
}
