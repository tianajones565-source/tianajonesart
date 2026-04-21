import CommissionForm from './form'

export default function CommissionsPage() {
  return (
    <main className="min-h-screen pt-28 md:pt-32 px-6 md:px-10 pb-24">
      <div className="max-w-2xl mx-auto">
        <header className="mb-12">
          <h1 className="text-white text-3xl md:text-4xl font-light tracking-tight">
            Commissions
          </h1>
          <p className="text-white/60 text-sm md:text-base leading-relaxed mt-5">
            Interested in a one-of-a-kind piece? Tell me a bit about what you&rsquo;re looking
            for and I&rsquo;ll be in touch if it&rsquo;s a fit.
          </p>
        </header>

        <section className="mb-12 border border-white/10 p-6 md:p-7">
          <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mb-5">
            How commissions work
          </h2>
          <ol className="space-y-3 text-white/70 text-sm leading-relaxed list-decimal list-inside marker:text-white/30">
            <li>Submit the form below with what you&rsquo;re looking for.</li>
            <li>If I can take it on, we&rsquo;ll confirm scope, size, and price by email.</li>
            <li>
              A <span className="text-white">50% non-refundable deposit</span> is paid via
              Stripe before work begins.
            </li>
            <li>I share progress as I go; final payment is due before delivery.</li>
            <li>Piece ships via my own carrier, or is available for local pickup.</li>
          </ol>

          <h2 className="text-white/80 text-xs tracking-[0.25em] uppercase mt-8 mb-5">
            Please note
          </h2>
          <ul className="space-y-2 text-white/70 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-white/30">—</span>
              <span>I do not accept checks, cashier&rsquo;s checks, or money orders.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-white/30">—</span>
              <span>I will never ask for or send overpayment for any reason.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-white/30">—</span>
              <span>
                Shipping is arranged by me only. I do not hand pieces to third-party shippers
                or pickup agents.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-white/30">—</span>
              <span>All communication stays on email until a commission is confirmed.</span>
            </li>
          </ul>
        </section>

        <CommissionForm />
      </div>
    </main>
  )
}
