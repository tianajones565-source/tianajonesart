import { createClient } from '@/lib/supabase/server'

export type BioSettings = { markdown: string }
export type ContactSettings = { email: string; instagram: string; note: string }
export type SlideshowSettings = { interval_ms: number; fade_ms: number }
export type CommissionsSettings = {
  intro: string
  how_heading: string
  how_steps: string[]
  note_heading: string
  note_items: string[]
  ack_text: string
}

export type SiteSettings = {
  bio: BioSettings
  contact: ContactSettings
  slideshow: SlideshowSettings
  commissions: CommissionsSettings
}

const DEFAULT_COMMISSIONS: CommissionsSettings = {
  intro:
    'Interested in a one-of-a-kind piece? Tell me a bit about what you’re looking for and I’ll be in touch if it’s a fit.',
  how_heading: 'How commissions work',
  how_steps: [
    'Submit the form below with what you’re looking for.',
    'If I can take it on, we’ll confirm scope, size, and price by email.',
    'A 50% non-refundable deposit is paid via Stripe before work begins.',
    'I share progress as I go; final payment is due before delivery.',
    'Piece ships via my own carrier, or is available for local pickup.',
  ],
  note_heading: 'Please note',
  note_items: [
    'I do not accept checks, cashier’s checks, or money orders.',
    'I will never ask for or send overpayment for any reason.',
    'Shipping is arranged by me only. I do not hand pieces to third-party shippers or pickup agents.',
    'All communication stays on email until a commission is confirmed.',
  ],
  ack_text:
    'I’ve read the commission terms above. I understand payment is via Stripe (no checks or money orders), there is no overpayment or third-party shipping, and work begins after the deposit clears.',
}

const DEFAULTS: SiteSettings = {
  bio: { markdown: '' },
  contact: { email: '', instagram: '', note: '' },
  slideshow: { interval_ms: 6000, fade_ms: 2000 },
  commissions: DEFAULT_COMMISSIONS,
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value')

  const map = new Map((data ?? []).map((r) => [r.key, r.value]))
  return {
    bio: { ...DEFAULTS.bio, ...(map.get('bio') ?? {}) },
    contact: { ...DEFAULTS.contact, ...(map.get('contact') ?? {}) },
    slideshow: { ...DEFAULTS.slideshow, ...(map.get('slideshow') ?? {}) },
    commissions: { ...DEFAULTS.commissions, ...(map.get('commissions') ?? {}) },
  }
}
