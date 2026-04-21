import { notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import EditForm from './edit-form'

export default async function EditArtworkPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: artwork } = await supabase
    .from('artworks')
    .select('*')
    .eq('id', id)
    .single()

  if (!artwork) notFound()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const imageUrl = `${supabaseUrl}/storage/v1/object/public/artworks/${artwork.image_path}`

  return (
    <main className="min-h-screen pt-28 px-6 md:px-10 pb-20 max-w-3xl mx-auto">
      <div className="mb-10">
        <Link
          href="/admin"
          className="text-white/40 hover:text-white/70 text-xs tracking-[0.2em] uppercase transition-colors"
        >
          ← Back to admin
        </Link>
        <h1 className="text-white text-2xl font-light tracking-tight mt-4">Edit</h1>
        <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-1">{artwork.title}</p>
      </div>

      <EditForm artwork={artwork} imageUrl={imageUrl} />
    </main>
  )
}
