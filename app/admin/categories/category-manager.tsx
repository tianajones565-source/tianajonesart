'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import {
  createCategory,
  deleteCategory,
  moveCategory,
  renameCategory,
} from './actions'

type Category = {
  id: string
  slug: string
  label: string
  display_order: number
  count: number
}

export default function CategoryManager({
  categories,
}: {
  categories: Category[]
}) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [newLabel, setNewLabel] = useState('')
  const [createError, setCreateError] = useState('')
  const [editing, setEditing] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState('')
  const [rowError, setRowError] = useState<{ id: string; msg: string } | null>(null)

  function run(fn: () => Promise<{ error?: string; success?: boolean }>) {
    startTransition(async () => {
      const res = await fn()
      if (!res.error) router.refresh()
    })
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setCreateError('')
    const label = newLabel
    startTransition(async () => {
      const res = await createCategory(label)
      if (res.error) {
        setCreateError(res.error)
        return
      }
      setNewLabel('')
      router.refresh()
    })
  }

  async function handleRename(id: string) {
    setRowError(null)
    const label = editLabel
    startTransition(async () => {
      const res = await renameCategory(id, label)
      if (res.error) {
        setRowError({ id, msg: res.error })
        return
      }
      setEditing(null)
      router.refresh()
    })
  }

  async function handleDelete(cat: Category) {
    setRowError(null)
    if (!confirm(`Delete "${cat.label}"?`)) return
    startTransition(async () => {
      const res = await deleteCategory(cat.id)
      if (res.error) {
        setRowError({ id: cat.id, msg: res.error })
        return
      }
      router.refresh()
    })
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mb-5">Add category</h2>
        <form onSubmit={handleCreate} className="flex gap-3">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            placeholder="e.g. Murals"
            className="flex-1 bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-2 text-white text-sm placeholder:text-white/30 transition-colors"
          />
          <button
            type="submit"
            disabled={pending || !newLabel.trim()}
            className="bg-white text-black px-5 py-2 text-[10px] tracking-[0.2em] uppercase font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity"
          >
            Add
          </button>
        </form>
        {createError && <p className="text-red-400/80 text-xs mt-3">{createError}</p>}
      </section>

      <section>
        <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mb-5">
          Current categories
        </h2>
        {categories.length === 0 ? (
          <p className="text-white/40 text-sm">No categories yet.</p>
        ) : (
          <ul className="divide-y divide-white/10">
            {categories.map((cat, i) => {
              const isFirst = i === 0
              const isLast = i === categories.length - 1
              return (
                <li key={cat.id} className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => run(() => moveCategory(cat.id, 'up'))}
                        disabled={pending || isFirst}
                        className="text-white/50 hover:text-white text-xs disabled:opacity-20 transition-colors"
                        aria-label="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => run(() => moveCategory(cat.id, 'down'))}
                        disabled={pending || isLast}
                        className="text-white/50 hover:text-white text-xs disabled:opacity-20 transition-colors"
                        aria-label="Move down"
                      >
                        ▼
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      {editing === cat.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            autoFocus
                            className="flex-1 bg-transparent border-b border-white/40 outline-none py-1 text-white text-sm"
                          />
                          <button
                            onClick={() => handleRename(cat.id)}
                            disabled={pending}
                            className="text-white text-[10px] tracking-[0.2em] uppercase hover:text-white/70 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditing(null)
                              setRowError(null)
                            }}
                            className="text-white/50 text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="text-white text-sm">{cat.label}</p>
                          <p className="text-white/40 text-[10px] tracking-[0.15em] uppercase mt-0.5">
                            {cat.slug} · {cat.count} {cat.count === 1 ? 'piece' : 'pieces'}
                          </p>
                        </>
                      )}
                    </div>

                    {editing !== cat.id && (
                      <div className="flex gap-4 flex-shrink-0">
                        <button
                          onClick={() => {
                            setEditing(cat.id)
                            setEditLabel(cat.label)
                          }}
                          className="text-white/60 text-[10px] tracking-[0.2em] uppercase hover:text-white transition-colors"
                        >
                          Rename
                        </button>
                        <button
                          onClick={() => handleDelete(cat)}
                          disabled={pending}
                          className="text-red-400/70 text-[10px] tracking-[0.2em] uppercase hover:text-red-400 transition-colors disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                  {rowError?.id === cat.id && (
                    <p className="text-red-400/80 text-xs mt-2">{rowError.msg}</p>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <section className="pt-8 border-t border-white/10">
        <p className="text-white/40 text-xs leading-relaxed">
          Tip: To change which category a piece belongs to, open the piece from the admin
          home and use Edit. Categories can only be deleted when no pieces reference them.
        </p>
      </section>
    </div>
  )
}
