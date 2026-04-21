import Link from 'next/link'
import { getSettings } from '@/lib/settings'

export default async function Contact() {
  const { contact } = await getSettings()
  const igHandle = contact.instagram.replace(/^@/, '')
  const igUrl = igHandle ? `https://instagram.com/${igHandle}` : ''

  return (
    <main className="min-h-screen pt-28 md:pt-32 px-6 md:px-10 pb-20">
      <div className="max-w-2xl">
        <h1 className="text-white text-3xl md:text-4xl font-light tracking-tight">Contact</h1>

        {contact.note && (
          <p className="text-white/70 text-sm md:text-base leading-relaxed mt-6 whitespace-pre-line">
            {contact.note}
          </p>
        )}

        <div className="mt-10 space-y-5">
          {contact.email && (
            <div>
              <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-1">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="text-white text-sm md:text-base hover:text-white/70 transition-colors"
              >
                {contact.email}
              </a>
            </div>
          )}
          {contact.instagram && (
            <div>
              <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-1">Instagram</p>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm md:text-base hover:text-white/70 transition-colors"
              >
                @{igHandle}
              </a>
            </div>
          )}
          {!contact.email && !contact.instagram && (
            <p className="text-white/40 text-sm">Contact details coming soon.</p>
          )}
        </div>

        <div className="mt-12 pt-8 border-t border-white/10">
          <p className="text-white/40 text-[10px] tracking-[0.25em] uppercase mb-2">Commissions</p>
          <Link
            href="/commissions"
            className="text-white text-sm md:text-base hover:text-white/70 transition-colors"
          >
            Request a custom piece →
          </Link>
        </div>
      </div>
    </main>
  )
}
