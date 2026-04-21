import CommissionForm from './form'

export default function CommissionsPage() {
  return (
    <main className="min-h-screen pt-28 md:pt-32 px-6 md:px-10 pb-24">
      <div className="max-w-xl mx-auto">
        <header className="mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-light tracking-tight">
            Commissions
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mt-5">
            Interested in a one-of-a-kind piece? Tell me a bit about what you&rsquo;re looking
            for and I&rsquo;ll be in touch.
          </p>
        </header>

        <CommissionForm />
      </div>
    </main>
  )
}
