'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { Category } from '@/lib/categories'
import { updateArtwork } from '../../../actions'
import HeroCropper, { type HeroCrop } from './hero-cropper'

type Artwork = {
  id: string
  title: string
  description: string | null
  category: string
  image_path: string
  price: number | null
  status: string
  featured: boolean
  hero_crop: HeroCrop | null
}

export default function EditForm({
  artwork,
  imageUrl,
  categories,
}: {
  artwork: Artwork
  imageUrl: string
  categories: Category[]
}) {
  const router = useRouter()
  const [title, setTitle] = useState(artwork.title)
  const [description, setDescription] = useState(artwork.description ?? '')
  const [category, setCategory] = useState(artwork.category)
  const [status, setStatus] = useState<Artwork['status']>(artwork.status)
  const [price, setPrice] = useState<string>(
    artwork.price !== null ? String(artwork.price) : ''
  )
  const [featured, setFeatured] = useState(artwork.featured)
  const [crop, setCrop] = useState<HeroCrop | null>(artwork.hero_crop)
  const [saving, setSaving] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const forSale = status === 'available' || status === 'sold'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setErrorMsg('')

    const result = await updateArtwork({
      id: artwork.id,
      title,
      description: description || null,
      category,
      price: forSale && price ? parseFloat(price) : null,
      status: status as 'available' | 'sold' | 'not_for_sale',
      featured,
      hero_crop: crop,
    })

    setSaving(false)
    if (result.error) {
      setErrorMsg(result.error)
      return
    }
    router.push('/admin')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        placeholder="Title"
        className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        rows={3}
        className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors resize-none"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm transition-colors"
      >
        {!categories.some((c) => c.slug === category) && (
          <option value={category} className="bg-[#0a0a0a]">
            {category} (missing)
          </option>
        )}
        {categories.map((c) => (
          <option key={c.id} value={c.slug} className="bg-[#0a0a0a]">
            {c.label}
          </option>
        ))}
      </select>

      <div>
        <p className="text-white/60 text-[10px] tracking-[0.2em] uppercase mb-3">Sale status</p>
        <div className="flex flex-wrap gap-5">
          {[
            { value: 'not_for_sale', label: 'Not for sale' },
            { value: 'available', label: 'Available' },
            { value: 'sold', label: 'Sold' },
          ].map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                value={opt.value}
                checked={status === opt.value}
                onChange={(e) => setStatus(e.target.value as Artwork['status'])}
                className="accent-white"
              />
              <span className="text-white/70 text-xs tracking-[0.2em] uppercase">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      {forSale && (
        <input
          type="number"
          step="0.01"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price (USD)"
          className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors"
        />
      )}

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={featured}
          onChange={(e) => setFeatured(e.target.checked)}
          className="accent-white"
        />
        <span className="text-white/70 text-xs tracking-[0.2em] uppercase">Make Hero</span>
      </label>

      {featured && (
        <div className="pt-4 border-t border-white/10">
          <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mb-4">Hero crop</h2>
          <HeroCropper imageUrl={imageUrl} value={crop} onChange={setCrop} />
        </div>
      )}

      {errorMsg && <p className="text-red-400/80 text-xs">{errorMsg}</p>}

      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 bg-white text-black py-3 text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity"
        >
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="px-6 text-white/60 hover:text-white text-xs tracking-[0.25em] uppercase transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
