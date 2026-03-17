import type { NextAuthConfig } from 'next-auth'
import Google from 'next-auth/providers/google'
import LinkedIn from 'next-auth/providers/linkedin'

// Public routes — accessible without auth
const PUBLIC_PATHS = [
  '/login',
  '/auth/signup',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/api/auth/signup',
  '/api/auth/verify-email',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
]

export const authConfig: NextAuthConfig = {
  providers: [Google, LinkedIn],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const path = nextUrl.pathname
      const isPublic = PUBLIC_PATHS.some(p => path === p || path.startsWith('/api/auth/'))

      if (isPublic) {
        // Redirect logged-in users away from login/signup
        if (isLoggedIn && (path === '/login' || path === '/auth/signup')) {
          return Response.redirect(new URL('/', nextUrl))
        }
        return true
      }

      if (!isLoggedIn) return Response.redirect(new URL('/login', nextUrl))
      return true
    },
  },
}
