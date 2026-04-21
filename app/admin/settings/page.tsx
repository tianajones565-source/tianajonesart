import Link from 'next/link'
import { getSettings } from '@/lib/settings'
import SettingsForm from './settings-form'

export default async function SettingsPage() {
  const settings = await getSettings()

  return (
    <main className="min-h-screen pt-28 px-6 md:px-10 pb-20 max-w-3xl mx-auto">
      <div className="mb-10">
        <Link
          href="/admin"
          className="text-white/40 hover:text-white/70 text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Back to admin
        </Link>
        <h1 className="text-white text-2xl font-light tracking-tight mt-4">Settings</h1>
        <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-1">Site content</p>
      </div>

      <SettingsForm initial={settings} />
    </main>
  )
}
