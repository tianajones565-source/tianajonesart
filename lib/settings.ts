import { createClient } from '@/lib/supabase/server'

export type BioSettings = { markdown: string }
export type ContactSettings = { email: string; instagram: string; note: string }
export type SlideshowSettings = { interval_ms: number; fade_ms: number }

export type SiteSettings = {
  bio: BioSettings
  contact: ContactSettings
  slideshow: SlideshowSettings
}

const DEFAULTS: SiteSettings = {
  bio: { markdown: '' },
  contact: { email: '', instagram: '', note: '' },
  slideshow: { interval_ms: 6000, fade_ms: 2000 },
}

export async function getSettings(): Promise<SiteSettings> {
  const supabase = await createClient()
  const { data } = await supabase.from('site_settings').select('key, value')

  const map = new Map((data ?? []).map((r) => [r.key, r.value]))
  return {
    bio: { ...DEFAULTS.bio, ...(map.get('bio') ?? {}) },
    contact: { ...DEFAULTS.contact, ...(map.get('contact') ?? {}) },
    slideshow: { ...DEFAULTS.slideshow, ...(map.get('slideshow') ?? {}) },
  }
}
