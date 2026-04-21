'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export type HeroCrop = { x: number; y: number; zoom: number } | null

export type Slide = {
  id: string
  title: string
  src: string
  hero_crop: HeroCrop
}

type Props = {
  slides: Slide[]
  intervalMs: number
  fadeMs: number
}

export default function HeroSlideshow({ slides, intervalMs, fadeMs }: Props) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length <= 1) return
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [slides.length, intervalMs])

  const active = slides[index]

  return (
    <>
      {slides.map((slide, i) => {
        const crop = slide.hero_crop
        const focalX = crop ? crop.x * 100 : 50
        const focalY = crop ? crop.y * 100 : 50
        const zoom = crop?.zoom ?? 1
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity ease-in-out"
            style={{
              opacity: i === index ? 1 : 0,
              transitionDuration: `${fadeMs}ms`,
            }}
          >
            <Image
              src={slide.src}
              alt={slide.title}
              fill
              className="object-cover"
              style={{
                objectPosition: `${focalX}% ${focalY}%`,
                transform: `scale(${zoom})`,
                transformOrigin: `${focalX}% ${focalY}%`,
              }}
              priority={i === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        )
      })}

      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />

      <div className="absolute bottom-6 left-6 md:bottom-8 md:left-10 z-20">
        <p className="text-white/90 text-xs tracking-[0.25em] uppercase">Tiana Jones</p>
        {active && (
          <p className="text-white/50 text-xs tracking-[0.2em] uppercase mt-1 italic">
            &ldquo;{active.title}&rdquo;
          </p>
        )}
      </div>
    </>
  )
}
