'use client'

import { useEffect, useRef } from 'react'

declare global {
  interface Window {
    turnstile: {
      render: (el: HTMLElement, opts: object) => string
      reset: (id: string) => void
    }
  }
}

interface Props {
  onVerify: (token: string) => void
}

export default function TurnstileWidget({ onVerify }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string>('')
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '1x00000000000000000000AA' // dev test key

  useEffect(() => {
    if (!ref.current) return
    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js'
    script.async = true
    script.onload = () => {
      widgetId.current = window.turnstile.render(ref.current!, {
        sitekey: siteKey,
        callback: onVerify,
      })
    }
    document.head.appendChild(script)
    return () => { script.remove() }
  }, [onVerify, siteKey])

  return <div ref={ref} className="mt-2" />
}
