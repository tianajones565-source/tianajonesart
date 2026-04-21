'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

function revalidatePublic() {
  revalidatePath('/admin')
  revalidatePath('/work')
  revalidatePath('/')
  revalidatePath('/about')
  revalidatePath('/contact')
}

type SaveArtworkInput = {
  title: string
  description: string | null
  category: string
  imagePath: string
  price: number | null
  status: 'available' | 'sold' | 'not_for_sale'
  featured: boolean
}

export async function saveArtwork(
  data: SaveArtworkInput
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  if (!data.title.trim()) return { error: 'Title is required' }
  if (!data.category) return { error: 'Category is required' }
  if (!data.imagePath) return { error: 'Image is required' }

  const { error } = await supabase.from('artworks').insert({
    title: data.title.trim(),
    description: data.description?.trim() || null,
    category: data.category,
    image_path: data.imagePath,
    price: data.price,
    status: data.status,
    featured: data.featured,
  })

  if (error) return { error: `Database error: ${error.message}` }

  revalidatePublic()
  return { success: true }
}

type UpdateArtworkInput = {
  id: string
  title: string
  description: string | null
  category: string
  price: number | null
  status: 'available' | 'sold' | 'not_for_sale'
  featured: boolean
  hero_crop: { x: number; y: number; zoom: number } | null
}

export async function updateArtwork(
  data: UpdateArtworkInput
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }
  if (!data.title.trim()) return { error: 'Title is required' }
  if (!data.category) return { error: 'Category is required' }

  const { error } = await supabase
    .from('artworks')
    .update({
      title: data.title.trim(),
      description: data.description?.trim() || null,
      category: data.category,
      price: data.price,
      status: data.status,
      featured: data.featured,
      hero_crop: data.hero_crop,
    })
    .eq('id', data.id)

  if (error) return { error: `Database error: ${error.message}` }

  revalidatePublic()
  return { success: true }
}

export async function deleteArtwork(id: string, _formData: FormData) {
  const supabase = await createClient()

  const { data: artwork } = await supabase
    .from('artworks')
    .select('image_path')
    .eq('id', id)
    .single()

  if (artwork) {
    await supabase.storage.from('artworks').remove([artwork.image_path])
  }

  await supabase.from('artworks').delete().eq('id', id)

  revalidatePublic()
}

export async function updateStatus(
  id: string,
  status: 'available' | 'sold' | 'not_for_sale',
  _formData: FormData
) {
  const supabase = await createClient()
  await supabase.from('artworks').update({ status }).eq('id', id)

  revalidatePublic()
}

export async function toggleFeatured(
  id: string,
  featured: boolean,
  _formData: FormData
) {
  const supabase = await createClient()
  await supabase.from('artworks').update({ featured }).eq('id', id)

  revalidatePublic()
}

export async function bulkSetFeatured(ids: string[], featured: boolean) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  if (ids.length === 0) return { success: true }

  const { error } = await supabase
    .from('artworks')
    .update({ featured })
    .in('id', ids)

  if (error) return { error: error.message }
  revalidatePublic()
  return { success: true }
}

export async function bulkDelete(ids: string[]) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }
  if (ids.length === 0) return { success: true }

  const { data: rows } = await supabase
    .from('artworks')
    .select('image_path')
    .in('id', ids)

  if (rows && rows.length > 0) {
    await supabase.storage.from('artworks').remove(rows.map((r) => r.image_path))
  }

  const { error } = await supabase.from('artworks').delete().in('id', ids)
  if (error) return { error: error.message }

  revalidatePublic()
  return { success: true }
}

type SettingsInput = {
  bio: { markdown: string }
  contact: { email: string; instagram: string; note: string }
  slideshow: { interval_ms: number; fade_ms: number }
  commissions: {
    intro: string
    how_heading: string
    how_steps: string[]
    note_heading: string
    note_items: string[]
    ack_text: string
  }
}

export async function updateSettings(
  data: SettingsInput
): Promise<{ error?: string; success?: boolean }> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const rows = [
    { key: 'bio', value: data.bio },
    { key: 'contact', value: data.contact },
    { key: 'slideshow', value: data.slideshow },
    { key: 'commissions', value: data.commissions },
  ]

  const { error } = await supabase
    .from('site_settings')
    .upsert(rows, { onConflict: 'key' })

  if (error) return { error: `Database error: ${error.message}` }

  revalidatePublic()
  return { success: true }
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
