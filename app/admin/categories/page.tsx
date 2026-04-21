import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import CategoryManager from './category-manager'

export default async function CategoriesPage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: artworks }] = await Promise.all([
    supabase
      .from('categories')
      .select('id, slug, label, display_order')
      .order('display_order', { ascending: true }),
    supabase.from('artworks').select('category'),
  ])

  const counts: Record<string, number> = {}
  for (const a of artworks ?? []) {
    counts[a.category] = (counts[a.category] ?? 0) + 1
  }

  const withCounts = (categories ?? []).map((c) => ({
    ...c,
    count: counts[c.slug] ?? 0,
  }))

  return (
    <main className="min-h-screen pt-28 px-6 md:px-10 pb-20 max-w-3xl mx-auto">
      <div className="mb-10">
        <Link
          href="/admin"
          className="text-white/40 hover:text-white/70 text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Back to admin
        </Link>
        <h1 className="text-white text-2xl font-light tracking-tight mt-4">Categories</h1>
        <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-1">
          Filters on the Work page
        </p>
      </div>

      <CategoryManager categories={withCounts} />
    </main>
  )
}
