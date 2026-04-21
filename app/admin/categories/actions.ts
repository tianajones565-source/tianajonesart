'use server'

import { createClient } from '@/lib/supabase/server'
import { slugify } from '@/lib/categories'
import { revalidatePath } from 'next/cache'

async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  return supabase
}

function revalidate() {
  revalidatePath('/admin')
  revalidatePath('/admin/categories')
  revalidatePath('/work')
}

export async function createCategory(
  label: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await requireAuth()
  const trimmed = label.trim()
  if (!trimmed) return { error: 'Label is required' }

  const slug = slugify(trimmed)
  if (!slug) return { error: 'Label must contain letters or numbers' }

  const { data: maxRow } = await supabase
    .from('categories')
    .select('display_order')
    .order('display_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const nextOrder = (maxRow?.display_order ?? -1) + 1

  const { error } = await supabase
    .from('categories')
    .insert({ slug, label: trimmed, display_order: nextOrder })

  if (error) {
    if (error.code === '23505') return { error: 'A category with that name already exists' }
    return { error: error.message }
  }

  revalidate()
  return { success: true }
}

export async function renameCategory(
  id: string,
  label: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await requireAuth()
  const trimmed = label.trim()
  if (!trimmed) return { error: 'Label is required' }

  const { error } = await supabase
    .from('categories')
    .update({ label: trimmed })
    .eq('id', id)

  if (error) return { error: error.message }
  revalidate()
  return { success: true }
}

export async function deleteCategory(
  id: string
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await requireAuth()

  const { data: cat } = await supabase
    .from('categories')
    .select('slug')
    .eq('id', id)
    .single()
  if (!cat) return { error: 'Category not found' }

  const { count } = await supabase
    .from('artworks')
    .select('*', { count: 'exact', head: true })
    .eq('category', cat.slug)

  if (count && count > 0) {
    return {
      error: `${count} artwork${count === 1 ? '' : 's'} use this category. Re-categorize them first (edit each piece), then delete.`,
    }
  }

  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }

  revalidate()
  return { success: true }
}

export async function moveCategory(
  id: string,
  direction: 'up' | 'down'
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await requireAuth()

  const { data: all } = await supabase
    .from('categories')
    .select('id, display_order')
    .order('display_order', { ascending: true })

  if (!all) return { error: 'Could not load categories' }

  const index = all.findIndex((c) => c.id === id)
  if (index === -1) return { error: 'Category not found' }

  const swapIndex = direction === 'up' ? index - 1 : index + 1
  if (swapIndex < 0 || swapIndex >= all.length) return { success: true }

  const a = all[index]
  const b = all[swapIndex]

  const { error: e1 } = await supabase
    .from('categories')
    .update({ display_order: b.display_order })
    .eq('id', a.id)
  if (e1) return { error: e1.message }

  const { error: e2 } = await supabase
    .from('categories')
    .update({ display_order: a.display_order })
    .eq('id', b.id)
  if (e2) return { error: e2.message }

  revalidate()
  return { success: true }
}
