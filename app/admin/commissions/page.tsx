import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CommissionRow from './commission-row'

export default async function AdminCommissionsPage() {
  const supabase = await createClient()

  const { data: commissions } = await supabase
    .from('commissions')
    .select('*')
    .order('created_at', { ascending: false })

  const rows = commissions ?? []
  const newCount = rows.filter((r) => r.status === 'new').length

  return (
    <main className="min-h-screen pt-28 px-6 md:px-10 pb-20 max-w-4xl mx-auto">
      <div className="mb-10">
        <Link
          href="/admin"
          className="text-white/40 hover:text-white/70 text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Back to admin
        </Link>
        <h1 className="text-white text-2xl font-light tracking-tight mt-4">Commissions</h1>
        <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-1">
          {rows.length} total · {newCount} new
        </p>
      </div>

      {rows.length === 0 ? (
        <p className="text-white/40 text-sm">No commission inquiries yet.</p>
      ) : (
        <ul className="divide-y divide-white/10">
          {rows.map((c) => (
            <CommissionRow key={c.id} commission={c} />
          ))}
        </ul>
      )}
    </main>
  )
}
