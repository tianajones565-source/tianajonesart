import Image from 'next/image'
import { deleteArtwork, updateStatus, toggleFeatured } from './actions'

type Artwork = {
  id: string
  title: string
  description: string | null
  category: string
  image_path: string
  price: number | null
  status: string
  featured: boolean
  created_at: string
}

export default function ArtworkList({ artworks }: { artworks: Artwork[] }) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  if (artworks.length === 0) {
    return (
      <p className="text-white/40 text-sm">No artworks yet. Upload your first piece above.</p>
    )
  }

  return (
    <ul className="divide-y divide-white/10">
      {artworks.map((art) => {
        const imageUrl = `${supabaseUrl}/storage/v1/object/public/artworks/${art.image_path}`
        return (
          <li key={art.id} className="flex items-start gap-4 py-5">
            <div className="relative w-20 h-20 flex-shrink-0 bg-white/5 overflow-hidden">
              <Image
                src={imageUrl}
                alt={art.title}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-white text-sm truncate">{art.title}</p>
              <p className="text-white/40 text-[10px] tracking-[0.15em] uppercase mt-1">
                {art.category}
                {art.price !== null && ` · $${art.price}`}
                {art.status === 'sold' && ' · Sold'}
                {art.status === 'not_for_sale' && ' · Not for sale'}
                {art.featured && ' · Hero'}
              </p>
            </div>

            <div className="flex flex-wrap gap-3 justify-end flex-shrink-0 max-w-[200px]">
              {art.status === 'available' && (
                <form action={updateStatus.bind(null, art.id, 'sold')}>
                  <button className="text-white/60 text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                    Mark sold
                  </button>
                </form>
              )}
              {art.status === 'sold' && (
                <form action={updateStatus.bind(null, art.id, 'available')}>
                  <button className="text-white/60 text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                    Mark available
                  </button>
                </form>
              )}
              <form action={toggleFeatured.bind(null, art.id, !art.featured)}>
                <button className="text-white/60 text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors">
                  {art.featured ? 'Remove Hero' : 'Make Hero'}
                </button>
              </form>
              <form action={deleteArtwork.bind(null, art.id)}>
                <button className="text-red-400/60 text-[10px] tracking-[0.15em] uppercase hover:text-red-400 transition-colors">
                  Delete
                </button>
              </form>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
