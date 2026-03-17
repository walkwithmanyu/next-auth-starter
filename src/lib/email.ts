import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

const FROM = process.env.SMTP_FROM ?? 'WePegasus <noreply@wepegasus.com>'
const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export async function sendVerificationEmail(email: string, token: string) {
  const url = `${BASE_URL}/auth/verify-email?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Verify your email — WePegasus',
    html: emailTemplate('Verify your email', `
      <p>Thanks for signing up. Click the button below to verify your email address.</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;font-size:14px;">Verify Email</a>
      <p style="color:#999;font-size:12px;margin-top:24px;">This link expires in 24 hours. If you didn't sign up, ignore this email.</p>
    `),
  })
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const url = `${BASE_URL}/auth/reset-password?token=${token}`
  await transporter.sendMail({
    from: FROM,
    to: email,
    subject: 'Reset your password — WePegasus',
    html: emailTemplate('Reset your password', `
      <p>We received a request to reset your password. Click the button below.</p>
      <a href="${url}" style="display:inline-block;padding:12px 24px;background:#000;color:#fff;text-decoration:none;font-size:14px;">Reset Password</a>
      <p style="color:#999;font-size:12px;margin-top:24px;">This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `),
  })
}

function emailTemplate(title: string, body: string) {
  return `
    <!DOCTYPE html>
    <html>
      <body style="margin:0;padding:40px 20px;background:#f9f9f9;font-family:-apple-system,sans-serif;color:#111;">
        <div style="max-width:480px;margin:0 auto;background:#fff;padding:40px;border:1px solid #e5e5e5;">
          <h1 style="font-size:20px;font-weight:600;margin:0 0 24px;">${title}</h1>
          ${body}
        </div>
      </body>
    </html>
  `
}
