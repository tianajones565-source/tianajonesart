import { getSettings } from '@/lib/settings'
import CommissionForm from './form'

export default async function CommissionsPage() {
  const { commissions } = await getSettings()

  return (
    <main className="min-h-screen pt-28 md:pt-32 px-6 md:px-10 pb-24">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-light tracking-tight">
            Commissions
          </h1>
          {commissions.intro && (
            <p className="text-white/60 text-sm md:text-base leading-relaxed mt-5 whitespace-pre-line">
              {commissions.intro}
            </p>
          )}
        </header>

        {(commissions.how_steps.length > 0 || commissions.note_items.length > 0) && (
          <section className="mb-12 border border-white/10 p-6 md:p-7">
            {commissions.how_steps.length > 0 && (
              <>
                <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mb-5">
                  {commissions.how_heading}
                </h2>
                <ol className="space-y-3 text-white/70 text-sm leading-relaxed list-decimal list-inside marker:text-white/30">
                  {commissions.how_steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </>
            )}

            {commissions.note_items.length > 0 && (
              <>
                <h2
                  className={`text-white/80 text-xs tracking-[0.25em] uppercase mb-5 ${
                    commissions.how_steps.length > 0 ? 'mt-8' : ''
                  }`}
                >
                  {commissions.note_heading}
                </h2>
                <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
                  {commissions.note_items.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-white/30">—</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </section>
        )}

        <CommissionForm ackText={commissions.ack_text} />
      </div>
    </main>
  )
}
