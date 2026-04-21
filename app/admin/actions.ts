'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

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

  revalidatePath('/admin')
  revalidatePath('/work')
  revalidatePath('/')
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

  revalidatePath('/admin')
  revalidatePath('/work')
  revalidatePath('/')
}

export async function updateStatus(
  id: string,
  status: 'available' | 'sold' | 'not_for_sale',
  _formData: FormData
) {
  const supabase = await createClient()
  await supabase.from('artworks').update({ status }).eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/work')
}

export async function toggleFeatured(
  id: string,
  featured: boolean,
  _formData: FormData
) {
  const supabase = await createClient()
  await supabase.from('artworks').update({ featured }).eq('id', id)

  revalidatePath('/admin')
  revalidatePath('/')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}
