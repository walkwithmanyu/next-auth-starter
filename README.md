# next-auth-starter

A complete, plug-and-play authentication module for Next.js 15 App Router.
Clone it, fill in your credentials, and you have a production-ready auth system in minutes.

## What's included

| Feature | Details |
|---|---|
| Google OAuth | Sign in with Google |
| LinkedIn OAuth | Sign in with LinkedIn |
| Email + Password | Sign up, sign in, forgot password, reset password |
| Email verification | Users must verify email before accessing the app |
| Bot protection | Cloudflare Turnstile on all forms |
| Rate limiting | Per-IP limits on all auth endpoints (DB-backed) |
| Session management | View and revoke active sessions per device |
| Account linking | Same email across OAuth + password auto-merges |
| TypeScript | Full type safety throughout |
| Prisma ORM | SQLite in dev, swap to any DB for production |

## Tech stack

- **Framework** — Next.js 15 (App Router)
- **Auth** — Auth.js v5 (next-auth@beta)
- **Database** — Prisma ORM + SQLite (dev) / PostgreSQL (prod)
- **Email** — Nodemailer (works with Resend, Postmark, SendGrid, Gmail)
- **Bot protection** — Cloudflare Turnstile
- **Styling** — Tailwind CSS v4

---

## Quick start

### 1. Use this template

```bash
git clone https://github.com/upamanyu/next-auth-starter.git my-app
cd my-app
npm install --include=dev
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local` — see comments in the file for where to get each value.

### 3. Set up the database

```bash
npx prisma migrate dev --name init
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you'll be redirected to `/login`.

---

## Setting up OAuth providers

### Google

1. Go to [console.cloud.google.com](https://console.cloud.google.com)
2. Create a project → APIs & Services → OAuth consent screen → External
3. Credentials → Create OAuth 2.0 Client ID → Web application
4. Add redirect URI: `http://localhost:3000/api/auth/callback/google`
5. Copy Client ID → `AUTH_GOOGLE_ID`, Client Secret → `AUTH_GOOGLE_SECRET`

### LinkedIn

1. Go to [linkedin.com/developers](https://www.linkedin.com/developers) → Create app
2. Products tab → Request **Sign In with LinkedIn using OpenID Connect**
3. Auth tab → Add redirect URI: `http://localhost:3000/api/auth/callback/linkedin`
4. Copy Client ID → `AUTH_LINKEDIN_ID`, Client Secret → `AUTH_LINKEDIN_SECRET`

---

## Setting up email

Recommended: **[Resend](https://resend.com)** — free tier, 3,000 emails/month, dead simple.

1. Sign up at resend.com → Add your domain → Create API key
2. Set `SMTP_HOST=smtp.resend.com`, `SMTP_USER=resend`, `SMTP_PASS=your-api-key`
3. Set `SMTP_FROM=Your App <noreply@yourdomain.com>`

---

## Setting up Cloudflare Turnstile

1. Go to [dash.cloudflare.com](https://dash.cloudflare.com) → Turnstile → Add site
2. Copy Site Key → `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
3. Copy Secret Key → `TURNSTILE_SECRET_KEY`

> **Dev tip:** Leave both keys blank in development — bot checks are automatically bypassed.

---

## Routes

| Route | Description |
|---|---|
| `GET /login` | Sign in (email+password, Google, LinkedIn) |
| `GET /auth/signup` | Create account |
| `GET /auth/verify-email` | Email verification landing page |
| `GET /auth/forgot-password` | Request password reset |
| `GET /auth/reset-password` | Set new password |
| `GET /account/sessions` | View and revoke active sessions |
| `POST /api/auth/signup` | Create account API |
| `GET /api/auth/verify-email` | Verify email token |
| `POST /api/auth/forgot-password` | Send reset email |
| `POST /api/auth/reset-password` | Update password |
| `GET /api/auth/sessions` | List sessions |
| `DELETE /api/auth/sessions` | Revoke a session |

---

## Switching to PostgreSQL for production

1. Update `DATABASE_URL` in your production env:
   ```
   DATABASE_URL="postgresql://user:password@host:5432/dbname"
   ```
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Run `npx prisma migrate deploy`

---

## Project structure

```
src/
├── app/
│   ├── login/              # Sign in page
│   ├── auth/
│   │   ├── signup/         # Create account
│   │   ├── verify-email/   # Email verification
│   │   ├── forgot-password/
│   │   └── reset-password/
│   ├── account/
│   │   └── sessions/       # Session management
│   └── api/auth/           # All auth API routes
├── components/auth/        # Reusable auth components
├── lib/
│   ├── auth.ts             # Auth.js config (full — with Prisma)
│   ├── auth.config.ts      # Auth.js config (edge-safe — for middleware)
│   ├── db.ts               # Prisma client singleton
│   ├── email.ts            # Email sending (Nodemailer)
│   ├── rate-limit.ts       # Per-IP rate limiting
│   └── turnstile.ts        # Cloudflare Turnstile verification
├── middleware.ts            # Route protection
└── types/next-auth.d.ts    # Session type extension
prisma/
└── schema.prisma           # DB schema
```

---

## License

MIT — use this in any project, commercial or personal.
