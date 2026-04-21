import { createClient } from '@/lib/supabase/server'
import { getSettings } from '@/lib/settings'
import HeroSlideshow, { type Slide } from './hero-slideshow'

export default async function Home() {
  const supabase = await createClient()
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  const [{ data: featured }, settings] = await Promise.all([
    supabase
      .from('artworks')
      .select('id, title, image_path, hero_crop')
      .eq('featured', true)
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false }),
    getSettings(),
  ])

  const slides: Slide[] =
    featured && featured.length > 0
      ? featured.map((a) => ({
          id: a.id,
          title: a.title,
          src: `${supabaseUrl}/storage/v1/object/public/artworks/${a.image_path}`,
          hero_crop: a.hero_crop ?? null,
        }))
      : [
          {
            id: 'default',
            title: 'What Does It Mean?',
            src: '/hero.jpeg',
            hero_crop: null,
          },
        ]

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <HeroSlideshow
        slides={slides}
        intervalMs={settings.slideshow.interval_ms}
        fadeMs={settings.slideshow.fade_ms}
      />
    </main>
  )
}
