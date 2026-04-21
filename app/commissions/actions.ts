'use server'

import { createClient } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { getSettings } from '@/lib/settings'

type SubmitInput = {
  name: string
  email: string
  budget: string
  timeline: string
  details: string
  honeypot: string
}

function escape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export async function submitCommission(
  input: SubmitInput
): Promise<{ error?: string; success?: boolean }> {
  if (input.honeypot) return { success: true }

  const name = input.name.trim()
  const email = input.email.trim()
  const details = input.details.trim()
  const budget = input.budget.trim()
  const timeline = input.timeline.trim()

  if (!name) return { error: 'Name is required' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Valid email required' }
  if (details.length < 20) {
    return { error: 'Please add a bit more detail (at least 20 characters)' }
  }

  const supabase = await createClient()
  const { data: row, error: insertError } = await supabase
    .from('commissions')
    .insert({
      name,
      email,
      budget: budget || null,
      timeline: timeline || null,
      details,
    })
    .select('id')
    .single()

  if (insertError || !row) {
    return { error: 'Could not save request. Please try again.' }
  }

  const settings = await getSettings()
  const to = settings.contact.email || process.env.COMMISSIONS_TO_EMAIL
  if (!to) {
    return { success: true }
  }

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #111; line-height: 1.6;">
      <h2 style="margin: 0 0 16px; font-weight: 500;">New commission inquiry</h2>
      <p style="margin: 0 0 8px;"><strong>From:</strong> ${escape(name)} &lt;${escape(email)}&gt;</p>
      ${budget ? `<p style="margin: 0 0 8px;"><strong>Budget:</strong> ${escape(budget)}</p>` : ''}
      ${timeline ? `<p style="margin: 0 0 8px;"><strong>Timeline:</strong> ${escape(timeline)}</p>` : ''}
      <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
      <p style="white-space: pre-wrap; margin: 0;">${escape(details)}</p>
    </div>
  `

  const emailResult = await sendEmail({
    to,
    subject: `Commission inquiry from ${name}`,
    html,
    replyTo: email,
  })

  if (emailResult.success) {
    await supabase.from('commissions').update({ email_sent: true }).eq('id', row.id)
  }

  return { success: true }
}
