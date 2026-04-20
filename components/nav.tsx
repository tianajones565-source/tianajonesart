import Link from 'next/link'

export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-5 md:px-10 md:py-7">
      <Link
        href="/"
        className="text-white text-xs font-medium tracking-[0.25em] uppercase"
      >
        Tiana Jones
      </Link>
      <div className="flex items-center gap-6 md:gap-10">
        {['Work', 'About', 'Contact'].map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="text-white/70 text-xs tracking-[0.2em] uppercase hover:text-white transition-colors duration-200"
          >
            {item}
          </Link>
        ))}
      </div>
    </nav>
  )
}
