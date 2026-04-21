'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import {
  bulkDelete,
  bulkSetFeatured,
  deleteArtwork,
  toggleFeatured,
  updateStatus,
} from './actions'

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
  const router = useRouter()
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [pending, startTransition] = useTransition()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  if (artworks.length === 0) {
    return <p className="text-white/40 text-sm">No artworks yet. Upload your first piece above.</p>
  }

  const allSelected = selected.size === artworks.length
  const anySelected = selected.size > 0

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(artworks.map((a) => a.id)))
  }

  function runBulk(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn()
      setSelected(new Set())
      router.refresh()
    })
  }

  function runSingle(fn: () => Promise<unknown> | unknown) {
    startTransition(async () => {
      await fn()
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 py-3 border-b border-white/10">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleAll}
            className="accent-white"
          />
          <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase">
            {anySelected ? `${selected.size} selected` : 'Select all'}
          </span>
        </label>

        {anySelected && (
          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => runBulk(() => bulkSetFeatured(Array.from(selected), true))}
              disabled={pending}
              className="text-white/70 text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors disabled:opacity-50"
            >
              Make Hero
            </button>
            <button
              onClick={() => runBulk(() => bulkSetFeatured(Array.from(selected), false))}
              disabled={pending}
              className="text-white/70 text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors disabled:opacity-50"
            >
              Remove Hero
            </button>
            <button
              onClick={() => {
                if (confirm(`Delete ${selected.size} piece(s)? This cannot be undone.`)) {
                  runBulk(() => bulkDelete(Array.from(selected)))
                }
              }}
              disabled={pending}
              className="text-red-400/80 text-[10px] tracking-[0.2em] uppercase hover:text-red-400 transition-colors disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        )}
      </div>

      <ul className="divide-y divide-white/10">
        {artworks.map((art) => {
          const imageUrl = `${supabaseUrl}/storage/v1/object/public/artworks/${art.image_path}`
          const isSelected = selected.has(art.id)
          return (
            <li key={art.id} className="flex items-start gap-4 py-5">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggle(art.id)}
                className="mt-2 accent-white"
              />

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

              <div className="flex flex-wrap gap-3 justify-end flex-shrink-0 max-w-[240px]">
                <Link
                  href={`/admin/artworks/${art.id}/edit`}
                  className="text-white/60 text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors"
                >
                  Edit
                </Link>
                {art.status === 'available' && (
                  <button
                    onClick={() => runSingle(() => updateStatus(art.id, 'sold', new FormData()))}
                    disabled={pending}
                    className="text-white/60 text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors disabled:opacity-50"
                  >
                    Mark sold
                  </button>
                )}
                {art.status === 'sold' && (
                  <button
                    onClick={() => runSingle(() => updateStatus(art.id, 'available', new FormData()))}
                    disabled={pending}
                    className="text-white/60 text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors disabled:opacity-50"
                  >
                    Mark available
                  </button>
                )}
                <button
                  onClick={() => runSingle(() => toggleFeatured(art.id, !art.featured, new FormData()))}
                  disabled={pending}
                  className="text-white/60 text-[10px] tracking-[0.15em] uppercase hover:text-white transition-colors disabled:opacity-50"
                >
                  {art.featured ? 'Remove Hero' : 'Make Hero'}
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${art.title}"? This cannot be undone.`)) {
                      runSingle(() => deleteArtwork(art.id, new FormData()))
                    }
                  }}
                  disabled={pending}
                  className="text-red-400/60 text-[10px] tracking-[0.15em] uppercase hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
