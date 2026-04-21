import { createClient } from '@/lib/supabase/server'

export type Category = {
  id: string
  slug: string
  label: string
  display_order: number
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('categories')
    .select('id, slug, label, display_order')
    .order('display_order', { ascending: true })
    .order('label', { ascending: true })
  return data ?? []
}

export function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40)
}
