import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import UploadForm from './upload-form'
import ArtworkList from './artwork-list'
import { logout } from './actions'

export default async function AdminPage() {
  const supabase = await createClient()

  const [{ data: artworks }, { count: newCommissions }] = await Promise.all([
    supabase
      .from('artworks')
      .select('*')
      .order('created_at', { ascending: false }),
    supabase
      .from('commissions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'new'),
  ])

  return (
    <main className="min-h-screen pt-28 px-6 md:px-10 pb-20 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-14">
        <div>
          <h1 className="text-white text-2xl font-light tracking-tight">Admin</h1>
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-1">Manage portfolio</p>
        </div>
        <div className="flex items-center gap-5">
          <Link
            href="/admin/commissions"
            className="text-white/60 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors"
          >
            Commissions
            {newCommissions ? (
              <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 bg-white text-black text-[10px] tracking-normal rounded-full">
                {newCommissions}
              </span>
            ) : null}
          </Link>
          <Link
            href="/admin/settings"
            className="text-white/60 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors"
          >
            Settings
          </Link>
          <form action={logout}>
            <button className="text-white/60 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors">
              Log out
            </button>
          </form>
        </div>
      </div>

      <section className="mb-20">
        <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mb-6">Upload new piece</h2>
        <UploadForm />
      </section>

      <section>
        <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mb-4">
          Portfolio · {artworks?.length ?? 0}
        </h2>
        <ArtworkList artworks={artworks ?? []} />
      </section>
    </main>
  )
}
