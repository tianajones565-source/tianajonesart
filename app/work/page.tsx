import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/categories'
import Gallery from './gallery'

export default async function Work() {
  const supabase = await createClient()

  const [{ data: artworks }, categories] = await Promise.all([
    supabase
      .from('artworks')
      .select('id, title, description, category, image_path, price, status')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }),
    getCategories(),
  ])

  const subtitle = categories.map((c) => c.label).join(' · ')

  return (
    <main className="min-h-screen pt-28 md:pt-32 px-6 md:px-10 pb-20">
      <div className="max-w-7xl mx-auto">
        <header className="mb-10 md:mb-14">
          <h1 className="text-white text-3xl md:text-4xl font-light tracking-tight">Work</h1>
          {subtitle && (
            <p className="text-white/40 text-xs tracking-[0.25em] uppercase mt-2">{subtitle}</p>
          )}
        </header>

        <Gallery artworks={artworks ?? []} categories={categories} />
      </div>
    </main>
  )
}
