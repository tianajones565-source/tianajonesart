'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function uploadArtwork(
  _prevState: { error?: string; success?: boolean } | undefined,
  formData: FormData
) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { error: 'Not authenticated' }

  const file = formData.get('image') as File | null
  const title = (formData.get('title') as string)?.trim()
  const description = (formData.get('description') as string)?.trim() || null
  const category = (formData.get('category') as string)?.trim()
  const forSale = formData.get('for_sale') === 'on'
  const priceStr = formData.get('price') as string | null
  const featured = formData.get('featured') === 'on'

  if (!file || file.size === 0) return { error: 'Please select an image' }
  if (!title) return { error: 'Title is required' }
  if (!category) return { error: 'Category is required' }

  const ext = file.name.split('.').pop() || 'jpg'
  const path = `${crypto.randomUUID()}.${ext}`

  const { error: uploadError } = await supabase.storage
    .from('artworks')
    .upload(path, file, {
      contentType: file.type,
      upsert: false,
    })

  if (uploadError) return { error: `Upload failed: ${uploadError.message}` }

  const { error: insertError } = await supabase.from('artworks').insert({
    title,
    description,
    category,
    image_path: path,
    price: forSale && priceStr ? parseFloat(priceStr) : null,
    status: forSale ? 'available' : 'not_for_sale',
    featured,
  })

  if (insertError) {
    await supabase.storage.from('artworks').remove([path])
    return { error: `Database error: ${insertError.message}` }
  }

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
