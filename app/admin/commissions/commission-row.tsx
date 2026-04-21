'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { setCommissionStatus, deleteCommission } from './actions'

type Commission = {
  id: string
  created_at: string
  name: string
  email: string
  budget: string | null
  timeline: string | null
  details: string
  status: string
  email_sent: boolean
}

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'in_progress', label: 'In progress' },
  { value: 'done', label: 'Done' },
  { value: 'declined', label: 'Declined' },
]

export default function CommissionRow({ commission }: { commission: Commission }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState(commission.status === 'new')
  const [pending, startTransition] = useTransition()

  const date = new Date(commission.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  function run(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  return (
    <li className="py-5">
      <button
        onClick={() => setExpanded((x) => !x)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm truncate">
            {commission.name}
            <span className="text-white/40 font-normal"> · {commission.email}</span>
          </p>
          <p className="text-white/40 text-[10px] tracking-[0.15em] uppercase mt-1">
            {date}
            {commission.budget ? ` · ${commission.budget}` : ''}
            {commission.timeline ? ` · ${commission.timeline}` : ''}
            {` · ${STATUS_OPTIONS.find((s) => s.value === commission.status)?.label ?? commission.status}`}
            {!commission.email_sent && ' · Email failed'}
          </p>
        </div>
        <span className="text-white/40 text-[10px]">{expanded ? '−' : '+'}</span>
      </button>

      {expanded && (
        <div className="mt-4 pl-0">
          <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap">
            {commission.details}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-white/10">
            <a
              href={`mailto:${commission.email}?subject=Re: Your commission inquiry`}
              className="text-white text-[10px] tracking-[0.2em] uppercase hover:text-white/70 transition-colors"
            >
              Reply
            </a>

            <select
              value={commission.status}
              onChange={(e) => run(() => setCommissionStatus(commission.id, e.target.value))}
              disabled={pending}
              className="bg-transparent border border-white/20 text-white text-[10px] tracking-[0.2em] uppercase px-2 py-1 outline-none focus:border-white/60"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-[#0a0a0a]">
                  {s.label}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                if (confirm(`Delete inquiry from ${commission.name}?`)) {
                  run(() => deleteCommission(commission.id))
                }
              }}
              disabled={pending}
              className="text-red-400/70 text-[10px] tracking-[0.2em] uppercase hover:text-red-400 transition-colors disabled:opacity-50 ml-auto"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </li>
  )
}
