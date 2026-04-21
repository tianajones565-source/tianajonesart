'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'
import type { Category } from '@/lib/categories'

type Artwork = {
  id: string
  title: string
  description: string | null
  category: string
  image_path: string
  price: number | null
  status: string
}

export default function Gallery({
  artworks,
  categories,
}: {
  artworks: Artwork[]
  categories: Category[]
}) {
  const [filter, setFilter] = useState<string>('all')
  const [forSaleOnly, setForSaleOnly] = useState(false)
  const [active, setActive] = useState<Artwork | null>(null)

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const filters = useMemo(
    () => [{ value: 'all', label: 'All' }, ...categories.map((c) => ({ value: c.slug, label: c.label }))],
    [categories]
  )

  const labelBySlug = useMemo(() => {
    const m = new Map<string, string>()
    for (const c of categories) m.set(c.slug, c.label)
    return m
  }, [categories])

  const filtered = useMemo(() => {
    let list = filter === 'all' ? artworks : artworks.filter((a) => a.category === filter)
    if (forSaleOnly) list = list.filter((a) => a.status === 'available')
    return list
  }, [artworks, filter, forSaleOnly])

  const hasAnyForSale = useMemo(
    () => artworks.some((a) => a.status === 'available'),
    [artworks]
  )

  if (artworks.length === 0) {
    return <p className="text-white/40 text-sm">Portfolio coming soon.</p>
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-4 md:gap-x-8 mb-10 md:mb-14">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`text-xs tracking-[0.25em] uppercase transition-colors ${
              filter === f.value ? 'text-white' : 'text-white/40 hover:text-white/70'
            }`}
          >
            {f.label}
          </button>
        ))}

        {hasAnyForSale && (
          <button
            onClick={() => setForSaleOnly((v) => !v)}
            role="checkbox"
            aria-checked={forSaleOnly}
            className={`ml-auto inline-flex items-center gap-2.5 text-xs tracking-[0.25em] uppercase transition-colors group ${
              forSaleOnly ? 'text-white' : 'text-white/50 hover:text-white/80'
            }`}
          >
            <span
              aria-hidden="true"
              className={`inline-flex shrink-0 items-center justify-center w-4 h-4 border border-solid transition-colors ${
                forSaleOnly
                  ? 'border-white bg-white'
                  : 'border-white/50 group-hover:border-white/80 bg-transparent'
              }`}
            >
              {forSaleOnly && (
                <svg
                  viewBox="0 0 12 12"
                  width="12"
                  height="12"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2.5 6.5 l2.5 2.5 l4.5 -5" />
                </svg>
              )}
            </span>
            For sale only
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <p className="text-white/40 text-sm">
          {forSaleOnly ? 'Nothing available in this view right now.' : 'Nothing to show here yet.'}
        </p>
      ) : (
      <ul className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
        {filtered.map((art) => {
          const imageUrl = `${supabaseUrl}/storage/v1/object/public/artworks/${art.image_path}`
          return (
            <li key={art.id}>
              <button
                onClick={() => setActive(art)}
                className="group relative block w-full aspect-square overflow-hidden bg-white/5"
              >
                <Image
                  src={imageUrl}
                  alt={art.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(min-width: 768px) 33vw, 50vw"
                />
                {art.status === 'sold' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="text-white text-[10px] md:text-xs tracking-[0.3em] uppercase border border-white/80 px-3 py-1">
                      Sold
                    </span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs md:text-sm truncate">{art.title}</p>
                  <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase mt-0.5">
                    {labelBySlug.get(art.category) ?? art.category}
                    {art.status === 'available' && art.price !== null && ` · $${art.price}`}
                  </p>
                </div>
              </button>
            </li>
          )
        })}
      </ul>
      )}

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActive(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-6 md:p-10 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-5xl w-full max-h-full flex flex-col items-center gap-5 cursor-default"
          >
            <div className="relative w-full flex-1 min-h-0">
              <Image
                src={`${supabaseUrl}/storage/v1/object/public/artworks/${active.image_path}`}
                alt={active.title}
                width={1600}
                height={1600}
                className="w-full max-h-[75vh] object-contain"
              />
            </div>
            <div className="text-center">
              <p className="text-white text-sm md:text-base">{active.title}</p>
              <p className="text-white/50 text-[10px] md:text-xs tracking-[0.25em] uppercase mt-2">
                {labelBySlug.get(active.category) ?? active.category}
                {active.status === 'available' && active.price !== null && ` · $${active.price}`}
                {active.status === 'sold' && ' · Sold'}
              </p>
              {active.description && (
                <p className="text-white/60 text-xs md:text-sm mt-4 max-w-xl mx-auto leading-relaxed">
                  {active.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setActive(null)}
              className="absolute top-0 right-0 text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase"
              aria-label="Close"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
