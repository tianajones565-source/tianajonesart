'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const ITEMS = ['Work', 'About', 'Commissions', 'Contact'] as const

export default function Nav() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="text-white text-xs font-medium tracking-[0.25em] uppercase"
        >
          Tiana Jones
        </Link>

        <div className="flex items-center gap-6 md:gap-10">
          <Link
            href="/work"
            onClick={() => setOpen(false)}
            className="text-white/70 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors duration-200"
          >
            Work
          </Link>

          <div className="hidden md:flex items-center gap-10">
            {ITEMS.filter((i) => i !== 'Work').map((item) => (
              <Link
                key={item}
                href={`/${item.toLowerCase()}`}
                className="text-white/70 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors duration-200"
              >
                {item}
              </Link>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="md:hidden relative w-6 h-6 flex flex-col justify-center items-end gap-1.5"
          >
            <span
              className={`block h-px bg-white transition-all duration-300 ${
                open ? 'w-6 translate-y-[3.5px] rotate-45' : 'w-6'
              }`}
            />
            <span
              className={`block h-px bg-white transition-all duration-300 ${
                open ? 'w-6 -translate-y-[3.5px] -rotate-45' : 'w-4'
              }`}
            />
          </button>
        </div>
      </nav>

      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-sm md:hidden transition-opacity duration-300 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="h-full flex flex-col items-center justify-center gap-8">
          {ITEMS.filter((i) => i !== 'Work').map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              onClick={() => setOpen(false)}
              className="text-white text-sm tracking-[0.3em] uppercase hover:text-white/70 transition-colors"
            >
              {item}
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
