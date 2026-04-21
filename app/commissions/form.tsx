'use client'

import { useState } from 'react'
import { submitCommission } from './actions'

export default function CommissionForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')
  const [details, setDetails] = useState('')
  const [acknowledged, setAcknowledged] = useState(false)
  const [honeypot, setHoneypot] = useState('')
  const [pending, setPending] = useState(false)
  const [state, setState] = useState<{ error?: string; success?: boolean }>({})

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setPending(true)
    setState({})
    const result = await submitCommission({
      name,
      email,
      country,
      budget,
      timeline,
      details,
      acknowledged,
      honeypot,
    })
    setPending(false)
    setState(result)
    if (result.success) {
      setName('')
      setEmail('')
      setCountry('')
      setBudget('')
      setTimeline('')
      setDetails('')
      setAcknowledged(false)
    }
  }

  const inputClass =
    'w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors'
  const labelClass = 'text-white/50 text-[10px] tracking-[0.2em] uppercase mb-1 block'

  if (state.success) {
    return (
      <div className="border border-white/20 p-8 text-center">
        <p className="text-white text-base md:text-lg tracking-tight">Thank you.</p>
        <p className="text-white/50 text-sm mt-3 leading-relaxed">
          Your inquiry has been received. Tiana will reach out to the email you provided.
        </p>
        <button
          onClick={() => setState({})}
          className="mt-6 text-white/60 text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors"
        >
          Send another
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label>
          Leave this blank
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <div>
        <label className={labelClass}>Your name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className={labelClass}>Country / region</label>
        <input
          type="text"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
          placeholder="e.g. United States"
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className={labelClass}>Budget (optional)</label>
          <input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. $300-500"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Timeline (optional)</label>
          <input
            type="text"
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            placeholder="e.g. by June"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tell me about the piece</label>
        <textarea
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          required
          rows={6}
          placeholder="Size, medium, subject, style, any reference links…"
          className="w-full bg-transparent border border-white/20 focus:border-white/60 outline-none p-4 text-white text-sm placeholder:text-white/40 transition-colors resize-none rounded"
        />
      </div>

      <label className="flex items-start gap-3 cursor-pointer pt-2">
        <input
          type="checkbox"
          checked={acknowledged}
          onChange={(e) => setAcknowledged(e.target.checked)}
          required
          className="mt-1 accent-white"
        />
        <span className="text-white/70 text-xs leading-relaxed">
          I&rsquo;ve read the commission terms above. I understand payment is via Stripe
          (no checks or money orders), there is no overpayment or third-party shipping,
          and work begins after the deposit clears.
        </span>
      </label>

      {state.error && <p className="text-red-400/80 text-xs">{state.error}</p>}

      <button
        type="submit"
        disabled={pending || !acknowledged}
        className="w-full bg-white text-black py-3 text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity"
      >
        {pending ? 'Sending…' : 'Send inquiry'}
      </button>
    </form>
  )
}
