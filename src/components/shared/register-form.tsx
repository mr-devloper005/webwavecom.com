'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

type Tone = {
  muted: string
  action: string
  input: string
}

export function RegisterForm({ tone }: { tone: Tone }) {
  const router = useRouter()
  const { signup, isLoading } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim() || !email.trim() || !password) {
      setError('Please fill in your name, email, and password.')
      return
    }
    try {
      await signup(name.trim(), email.trim(), password)
      router.push('/articles')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <form className="mt-6 grid gap-4" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-2">
        <label htmlFor="register-name" className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
          Full name
        </label>
        <input
          id="register-name"
          name="name"
          autoComplete="name"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
          className={cn('h-12 rounded-xl border px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]', tone.input)}
          placeholder="Alex Writer"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="register-email" className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
          Email
        </label>
        <input
          id="register-email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(ev) => setEmail(ev.target.value)}
          className={cn('h-12 rounded-xl border px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]', tone.input)}
          placeholder="you@example.com"
        />
      </div>
      <div className="grid gap-2">
        <label htmlFor="register-password" className="text-xs font-semibold uppercase tracking-[0.2em] opacity-70">
          Password
        </label>
        <input
          id="register-password"
          name="password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
          className={cn('h-12 rounded-xl border px-4 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]', tone.input)}
          placeholder="••••••••"
        />
      </div>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <button
        type="submit"
        disabled={isLoading}
        className={cn(
          'inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-opacity disabled:opacity-60',
          tone.action,
        )}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        Create account
      </button>
      <p className={`text-xs leading-relaxed ${tone.muted}`}>
        We store your profile locally in the browser for this demo experience.
      </p>
      <div className={`flex flex-wrap items-center justify-between gap-2 text-sm ${tone.muted}`}>
        <span>Already have an account?</span>
        <Link href="/login" className="font-semibold hover:underline">
          Sign in
        </Link>
      </div>
    </form>
  )
}
