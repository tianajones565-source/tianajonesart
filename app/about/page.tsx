import { getSettings } from '@/lib/settings'

export default async function About() {
  const { bio } = await getSettings()
  const paragraphs = bio.markdown.split(/\n\s*\n/).filter(Boolean)

  return (
    <main className="min-h-screen pt-28 md:pt-32 px-6 md:px-10 pb-20">
      <div className="max-w-2xl">
        <h1 className="text-white text-3xl md:text-4xl font-light tracking-tight">About</h1>
        {paragraphs.length > 0 ? (
          <div className="mt-8 space-y-5">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-white/80 text-sm md:text-base leading-relaxed whitespace-pre-line">
                {p}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-white/40 text-sm mt-4">Bio coming soon.</p>
        )}
      </div>
    </main>
  )
}
