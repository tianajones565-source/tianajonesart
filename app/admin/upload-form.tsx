'use client'

import { useActionState, useEffect, useRef, useState } from 'react'
import { uploadArtwork } from './actions'

export default function UploadForm() {
  const [state, action, pending] = useActionState(uploadArtwork, undefined)
  const [forSale, setForSale] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (state?.success && formRef.current) {
      formRef.current.reset()
      setForSale(false)
      setFileName('')
    }
  }, [state])

  return (
    <form ref={formRef} action={action} className="space-y-5">
      <label className="block cursor-pointer border border-dashed border-white/20 hover:border-white/40 transition-colors py-12 px-6 text-center">
        <input
          name="image"
          type="file"
          accept="image/*"
          required
          className="hidden"
          onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
        />
        <span className="text-white/60 text-xs tracking-[0.2em] uppercase">
          {fileName || 'Click to select image'}
        </span>
      </label>

      <input
        name="title"
        type="text"
        placeholder="Title"
        required
        className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors"
      />

      <textarea
        name="description"
        placeholder="Description (optional)"
        rows={2}
        className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors resize-none"
      />

      <select
        name="category"
        required
        defaultValue=""
        className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm transition-colors"
      >
        <option value="" disabled className="bg-[#0a0a0a]">Category</option>
        <option value="painting" className="bg-[#0a0a0a]">Painting</option>
        <option value="digital" className="bg-[#0a0a0a]">Digital</option>
        <option value="school" className="bg-[#0a0a0a]">School Work</option>
      </select>

      <div className="flex items-center gap-6 pt-2">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            name="for_sale"
            type="checkbox"
            checked={forSale}
            onChange={(e) => setForSale(e.target.checked)}
            className="accent-white"
          />
          <span className="text-white/70 text-xs tracking-[0.2em] uppercase">For sale</span>
        </label>

        <label className="flex items-center gap-2 cursor-pointer">
          <input name="featured" type="checkbox" className="accent-white" />
          <span className="text-white/70 text-xs tracking-[0.2em] uppercase">Feature on home</span>
        </label>
      </div>

      {forSale && (
        <input
          name="price"
          type="number"
          step="0.01"
          min="0"
          placeholder="Price (USD)"
          required={forSale}
          className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors"
        />
      )}

      {state?.error && <p className="text-red-400/80 text-xs">{state.error}</p>}
      {state?.success && <p className="text-emerald-400/80 text-xs">Uploaded.</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-white text-black py-3 text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity"
      >
        {pending ? 'Uploading…' : 'Publish'}
      </button>
    </form>
  )
}
