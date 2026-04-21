import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import HeroSlideshow from './hero-slideshow'

export default async function Home() {
  const supabase = await createClient()

  const { data: featured } = await supabase
    .from('artworks')
    .select('id, title, image_path')
    .eq('featured', true)
    .order('display_order', { ascending: true })
    .order('created_at', { ascending: false })

  const slides = featured ?? []

  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {slides.length > 0 ? (
        <HeroSlideshow slides={slides} />
      ) : (
        <>
          <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none" />

          <Image
            src="/hero.jpeg"
            alt="What Does It Mean? — Tiana Jones"
            fill
            className="object-cover object-center"
            priority
            quality={90}
          />

          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

          <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 z-20">
            <p className="text-white/90 text-xs tracking-[0.25em] uppercase">Tiana Jones</p>
            <p className="text-white/50 text-xs tracking-[0.2em] uppercase mt-1 italic">
              &ldquo;What Does It Mean?&rdquo;
            </p>
          </div>
        </>
      )}
    </main>
  )
}
