'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

type Slide = {
  id: string
  title: string
  image_path: string
}

export default function HeroSlideshow({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(id)
  }, [slides.length])

  const active = slides[index]

  return (
    <>
      {slides.map((slide, i) => (
        <Image
          key={slide.id}
          src={`${supabaseUrl}/storage/v1/object/public/artworks/${slide.image_path}`}
          alt={slide.title}
          fill
          className={`object-cover object-center transition-opacity duration-[2000ms] ease-in-out ${
            i === index ? 'opacity-100' : 'opacity-0'
          }`}
          priority={i === 0}
          quality={90}
          sizes="100vw"
        />
      ))}

      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 z-20">
        <p className="text-white/90 text-xs tracking-[0.25em] uppercase">Tiana Jones</p>
        <p className="text-white/50 text-xs tracking-[0.2em] uppercase mt-1 italic">
          &ldquo;{active.title}&rdquo;
        </p>
      </div>
    </>
  )
}
