import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import LinkedIn from 'next-auth/providers/linkedin'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import bcrypt from 'bcryptjs'
import { db } from './db'
import { authConfig } from './auth.config'
import { verifyTurnstile } from './turnstile'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' }, // JWT works with Edge Runtime middleware
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    LinkedIn({
      clientId: process.env.AUTH_LINKEDIN_ID!,
      clientSecret: process.env.AUTH_LINKEDIN_SECRET!,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        turnstileToken: { label: 'Turnstile', type: 'text' },
      },
      async authorize(credentials) {
        const { email, password, turnstileToken } = credentials as {
          email: string
          password: string
          turnstileToken: string
        }

        if (!email || !password) return null

        const human = await verifyTurnstile(turnstileToken ?? '')
        if (!human) return null

        const user = await db.user.findUnique({ where: { email } })
        if (!user || !user.password) return null
        if (!user.emailVerified) return null

        const valid = await bcrypt.compare(password, user.password)
        if (!valid) return null

        return { id: user.id, name: user.name, email: user.email, image: user.image }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    session({ session, token }) {
      if (token?.id) session.user.id = token.id as string
      return session
    },
  },
})
