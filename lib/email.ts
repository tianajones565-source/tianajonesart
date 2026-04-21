import { Resend } from 'resend'

let cachedResend: Resend | null = null

function getResend() {
  if (cachedResend) return cachedResend
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  cachedResend = new Resend(key)
  return cachedResend
}

type SendArgs = {
  to: string
  subject: string
  html: string
  replyTo?: string
}

export async function sendEmail({ to, subject, html, replyTo }: SendArgs) {
  const resend = getResend()
  if (!resend) {
    return { error: 'Email service not configured' }
  }

  const from = process.env.COMMISSIONS_FROM_EMAIL || 'onboarding@resend.dev'
  const { error } = await resend.emails.send({
    from: `Tiana Jones <${from}>`,
    to,
    subject,
    html,
    replyTo,
  })

  if (error) return { error: error.message }
  return { success: true as const }
}
