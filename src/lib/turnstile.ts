// Cloudflare Turnstile bot protection
// Get your keys at: https://dash.cloudflare.com/?to=/:account/turnstile

export async function verifyTurnstile(token: string): Promise<boolean> {
  // In development with test keys, always pass
  if (process.env.NODE_ENV === 'development' && !process.env.TURNSTILE_SECRET_KEY) {
    return true
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      secret: process.env.TURNSTILE_SECRET_KEY,
      response: token,
    }),
  })

  const data = await res.json()
  return data.success === true
}
