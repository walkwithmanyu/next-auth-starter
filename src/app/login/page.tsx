import { signIn } from '@/lib/auth'
import EmailSignInForm from '@/components/auth/EmailSignInForm'

interface Props {
  searchParams: Promise<{ reset?: string; error?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-white">
      <div className="w-full max-w-sm border border-black/10 p-10">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-black">WePegasus</h1>
          <p className="mt-1 text-sm text-black/50">Sign in to your account</p>
        </div>

        {params.reset === 'success' && (
          <p className="mb-4 border border-black/10 bg-black/5 px-4 py-3 text-xs text-black">
            Password updated successfully. Sign in below.
          </p>
        )}

        {params.error && (
          <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-700">
            {params.error === 'OAuthAccountNotLinked'
              ? 'This email is linked to another provider. Sign in with that instead.'
              : 'Sign in failed. Please try again.'}
          </p>
        )}

        {/* Email + Password */}
        <EmailSignInForm />

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-black/10" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-xs text-black/30">or</span>
          </div>
        </div>

        {/* OAuth */}
        <div className="flex flex-col gap-3">
          <form
            action={async () => {
              'use server'
              await signIn('google', { redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 border border-black/15 px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>

          <form
            action={async () => {
              'use server'
              await signIn('linkedin', { redirectTo: '/' })
            }}
          >
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-3 border border-black/15 px-4 py-3 text-sm font-medium text-black transition hover:bg-black/5"
            >
              <LinkedInIcon />
              Continue with LinkedIn
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-black/40">
          No account?{' '}
          <a href="/auth/signup" className="text-black underline">Create one</a>
        </p>

        <p className="mt-8 text-center text-xs text-black/30">
          By signing in, you agree to our Terms and Privacy Policy.
        </p>
      </div>
    </main>
  )
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z" fill="#34A853"/>
      <path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z" fill="#EA4335"/>
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <rect width="18" height="18" rx="2" fill="#0A66C2"/>
      <path d="M5.163 7.237H3v6.526h2.163V7.237ZM4.082 6.3a1.253 1.253 0 1 0 0-2.507 1.253 1.253 0 0 0 0 2.507ZM15 13.763h-2.16v-3.176c0-.757-.014-1.73-1.054-1.73-1.056 0-1.218.824-1.218 1.675v3.231H8.41V7.237h2.074v.892h.029c.288-.547.993-1.124 2.044-1.124 2.188 0 2.593 1.44 2.593 3.312v3.446H15Z" fill="white"/>
    </svg>
  )
}
