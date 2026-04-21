'use client'

import { useRef, useState } from 'react'

export type HeroCrop = { x: number; y: number; zoom: number }

type Props = {
  imageUrl: string
  value: HeroCrop | null
  onChange: (crop: HeroCrop | null) => void
}

const DEFAULT_CROP: HeroCrop = { x: 0.5, y: 0.5, zoom: 1 }

export default function HeroCropper({ imageUrl, value, onChange }: Props) {
  const crop = value ?? DEFAULT_CROP
  const imageRef = useRef<HTMLDivElement>(null)
  const [dragging, setDragging] = useState(false)

  function setFocal(clientX: number, clientY: number) {
    const el = imageRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height))
    onChange({ ...crop, x, y })
  }

  return (
    <div className="space-y-5">
      <p className="text-white/50 text-[11px] leading-relaxed">
        Click and drag on the image to set the focal point (what stays centered when the piece
        is used as a hero). Use zoom to crop in tighter and hide surrounding wall or floor.
      </p>

      <div
        ref={imageRef}
        onPointerDown={(e) => {
          ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
          setDragging(true)
          setFocal(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (dragging) setFocal(e.clientX, e.clientY)
        }}
        onPointerUp={() => setDragging(false)}
        className="relative w-full aspect-video bg-black overflow-hidden cursor-crosshair select-none"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt=""
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{
            objectPosition: `${crop.x * 100}% ${crop.y * 100}%`,
            transform: `scale(${crop.zoom})`,
            transformOrigin: `${crop.x * 100}% ${crop.y * 100}%`,
          }}
        />
        <div
          className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-white bg-white/30 pointer-events-none shadow-lg"
          style={{ left: `${crop.x * 100}%`, top: `${crop.y * 100}%` }}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-white/60 text-[10px] tracking-[0.2em] uppercase">Zoom</span>
          <span className="text-white/40 text-[10px]">{crop.zoom.toFixed(2)}×</span>
        </div>
        <input
          type="range"
          min={1}
          max={3}
          step={0.05}
          value={crop.zoom}
          onChange={(e) => onChange({ ...crop, zoom: parseFloat(e.target.value) })}
          className="w-full accent-white"
        />
      </div>

      <div className="flex gap-4 text-[10px] tracking-[0.2em] uppercase">
        <button
          type="button"
          onClick={() => onChange(DEFAULT_CROP)}
          className="text-white/60 hover:text-white transition-colors"
        >
          Reset
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="text-white/60 hover:text-white transition-colors"
          >
            Clear crop
          </button>
        )}
      </div>

      <div className="pt-2">
        <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mb-2">Hero preview</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Desktop 16:9', ratio: 'aspect-video' },
            { label: 'Phone 9:16', ratio: 'aspect-[9/16]' },
          ].map((p) => (
            <div key={p.label}>
              <div
                className={`relative w-full ${p.ratio} bg-black overflow-hidden`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    objectPosition: `${crop.x * 100}% ${crop.y * 100}%`,
                    transform: `scale(${crop.zoom})`,
                    transformOrigin: `${crop.x * 100}% ${crop.y * 100}%`,
                  }}
                />
              </div>
              <p className="text-white/40 text-[10px] mt-1">{p.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
