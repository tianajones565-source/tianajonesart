import Image from 'next/image'

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/70 to-transparent z-10 pointer-events-none" />

      <Image
        src="/hero.jpeg"
        alt="What Does It Mean? — Tiana Jones"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none" />
    </main>
  )
}
