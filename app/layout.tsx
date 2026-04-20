import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import Nav from '@/components/nav'
import './globals.css'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Tiana Jones — Artist',
  description: 'Portfolio of Tiana Jones — paintings, digital art, and commissions.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="bg-[#0a0a0a] text-white antialiased h-full">
        <Nav />
        {children}
      </body>
    </html>
  )
}
