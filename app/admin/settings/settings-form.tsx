'use client'

import { useState } from 'react'
import { updateSettings } from '../actions'
import type { SiteSettings } from '@/lib/settings'

export default function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [bio, setBio] = useState(initial.bio.markdown)
  const [email, setEmail] = useState(initial.contact.email)
  const [instagram, setInstagram] = useState(initial.contact.instagram)
  const [contactNote, setContactNote] = useState(initial.contact.note)
  const [intervalSec, setIntervalSec] = useState(
    Math.round(initial.slideshow.interval_ms / 1000)
  )
  const [fadeSec, setFadeSec] = useState(
    Math.round(initial.slideshow.fade_ms / 100) / 10
  )
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState<{ error?: string; success?: boolean }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMsg({})

    const result = await updateSettings({
      bio: { markdown: bio },
      contact: { email, instagram, note: contactNote },
      slideshow: {
        interval_ms: Math.round(intervalSec * 1000),
        fade_ms: Math.round(fadeSec * 1000),
      },
    })

    setSaving(false)
    setMsg(result)
  }

  const sectionClass = 'border-t border-white/10 pt-8'
  const sectionHeader = 'text-white/80 text-xs tracking-[0.25em] uppercase mb-5'
  const labelClass = 'text-white/50 text-[10px] tracking-[0.2em] uppercase mb-2 block'
  const inputClass =
    'w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-2 text-white text-sm placeholder:text-white/30 transition-colors'
  const textareaClass =
    'w-full bg-transparent border border-white/20 focus:border-white/60 outline-none p-3 text-white text-sm placeholder:text-white/30 transition-colors resize-none rounded'

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      <section>
        <h2 className={sectionHeader}>Bio</h2>
        <label className={labelClass}>Artist bio (shown on /about)</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={8}
          placeholder="A few paragraphs about Tiana…"
          className={textareaClass}
        />
        <p className="text-white/30 text-[10px] mt-2">Line breaks are preserved.</p>
      </section>

      <section className={sectionClass}>
        <h2 className={sectionHeader}>Contact</h2>
        <div className="space-y-6">
          <div>
            <label className={labelClass}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tiana@example.com"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Instagram handle</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="@tianajones"
              className={inputClass}
            />
          </div>
          <div>
            <label className={labelClass}>Note on contact page</label>
            <textarea
              value={contactNote}
              onChange={(e) => setContactNote(e.target.value)}
              rows={3}
              placeholder="For commissions and inquiries…"
              className={textareaClass}
            />
          </div>
        </div>
      </section>

      <section className={sectionClass}>
        <h2 className={sectionHeader}>Home slideshow</h2>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass + ' mb-0'}>Seconds per slide</label>
              <span className="text-white/60 text-xs">{intervalSec}s</span>
            </div>
            <input
              type="range"
              min={2}
              max={20}
              step={1}
              value={intervalSec}
              onChange={(e) => setIntervalSec(parseInt(e.target.value))}
              className="w-full accent-white"
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className={labelClass + ' mb-0'}>Fade duration</label>
              <span className="text-white/60 text-xs">{fadeSec.toFixed(1)}s</span>
            </div>
            <input
              type="range"
              min={0.2}
              max={5}
              step={0.1}
              value={fadeSec}
              onChange={(e) => setFadeSec(parseFloat(e.target.value))}
              className="w-full accent-white"
            />
          </div>
        </div>
      </section>

      {msg.error && <p className="text-red-400/80 text-xs">{msg.error}</p>}
      {msg.success && <p className="text-emerald-400/80 text-xs">Saved.</p>}

      <button
        type="submit"
        disabled={saving}
        className="w-full bg-white text-black py-3 text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity"
      >
        {saving ? 'Saving…' : 'Save'}
      </button>
    </form>
  )
}
