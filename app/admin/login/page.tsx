'use client'

import { useActionState } from 'react'
import { login } from './actions'

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, undefined)

  return (
    <main className="min-h-screen flex items-center justify-center pt-20 px-6">
      <form action={action} className="w-full max-w-sm space-y-8">
        <div>
          <h1 className="text-white text-xl tracking-tight font-light">Sign in</h1>
          <p className="text-white/40 text-xs tracking-[0.2em] uppercase mt-2">Admin access</p>
        </div>
        <div className="space-y-5">
          <input
            name="email"
            type="email"
            placeholder="Email"
            autoComplete="email"
            required
            className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            required
            className="w-full bg-transparent border-b border-white/20 focus:border-white/60 outline-none py-3 text-white text-sm placeholder:text-white/40 transition-colors"
          />
        </div>
        {state?.error && <p className="text-red-400/80 text-xs">{state.error}</p>}
        <button
          type="submit"
          disabled={pending}
          className="w-full bg-white text-black py-3 text-xs tracking-[0.25em] uppercase font-medium hover:bg-white/90 disabled:opacity-50 transition-opacity"
        >
          {pending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  )
}
