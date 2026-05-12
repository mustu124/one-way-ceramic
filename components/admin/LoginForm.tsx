'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login(event: React.FormEvent) {
    event.preventDefault()
    setError('')
    if (!supabase) {
      setError('Supabase env vars are missing. Add .env.local to enable admin login.')
      return
    }
    setLoading(true)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) {
      setError(authError.message)
      return
    }
    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <form onSubmit={login} className="mx-auto w-full max-w-md rounded-lg bg-white p-6 shadow-soft">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gold-dark">Admin Login</p>
      <h1 className="mt-2 font-heading text-4xl font-semibold">One Way Ceramic</h1>
      <div className="mt-6 grid gap-4">
        <label className="grid gap-1 text-sm font-medium">Email<input className="admin-input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
        <label className="grid gap-1 text-sm font-medium">Password<input className="admin-input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
      </div>
      {error && <p className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      <button disabled={loading} className="mt-6 min-h-12 w-full rounded-full bg-brown px-5 font-semibold text-white disabled:opacity-60">{loading ? 'Signing in...' : 'Sign In'}</button>
    </form>
  )
}
