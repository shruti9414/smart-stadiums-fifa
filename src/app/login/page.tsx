'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'admin' | 'staff' | 'visitor' | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Login failed')
      }

      const data = await res.json()
      setAuth(data.data.user, data.data.token)

      // Redirect based on role
      const role = data.data.user.role
      if (role === 'admin') {
        router.push('/admin')
      } else if (role === 'staff') {
        router.push('/staff')
      } else {
        router.push('/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent mb-2">
            Smart Stadiums
          </h1>
          <p className="text-slate-400">FIFA World Cup 2026</p>
        </div>

        {/* Form Card */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/40 to-slate-950 p-8 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg bg-slate-800/50 border border-slate-700 px-4 py-2 text-white placeholder:text-slate-500 focus:border-yellow-500 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-600 px-4 py-2 font-semibold text-black hover:from-yellow-400 hover:to-yellow-500 disabled:opacity-50 transition-all"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {selectedRole !== 'admin' && selectedRole !== 'staff' && (
            <div className="mt-6 text-center text-sm text-slate-400">
              <span className="text-slate-500">👤 Visitors:</span> Don't have an account?{' '}
              <a href="/register" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Create One
              </a>
            </div>
          )}
        </div>

        {/* Demo Credentials - 3 Roles */}
        <div className="mt-8 space-y-3">
          <p className="text-center text-sm font-semibold text-slate-300 mb-4">Quick Demo Login</p>

          {/* Admin */}
          <button
            onClick={() => {
              setEmail('admin@stadium.com')
              setPassword('Admin@12345')
              setSelectedRole('admin')
            }}
            className="w-full rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-left hover:bg-purple-500/20 transition-all"
          >
            <p className="font-bold text-purple-300">👨‍💼 Admin</p>
            <p className="text-xs text-slate-400 mt-1">admin@stadium.com</p>
            <p className="text-xs text-slate-500">Operations Center</p>
          </button>

          {/* Staff */}
          <button
            onClick={() => {
              setEmail('staff@stadium.com')
              setPassword('Staff@12345')
              setSelectedRole('staff')
            }}
            className="w-full rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 text-left hover:bg-blue-500/20 transition-all"
          >
            <p className="font-bold text-blue-300">🚨 Staff/Security</p>
            <p className="text-xs text-slate-400 mt-1">staff@stadium.com</p>
            <p className="text-xs text-slate-500">Quick Response</p>
          </button>

          {/* Visitor */}
          <button
            onClick={() => {
              setEmail('visitor@stadium.com')
              setPassword('Visitor@12345')
              setSelectedRole('visitor')
            }}
            className="w-full rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-left hover:bg-green-500/20 transition-all"
          >
            <p className="font-bold text-green-300">👤 Visitor</p>
            <p className="text-xs text-slate-400 mt-1">visitor@stadium.com</p>
            <p className="text-xs text-slate-500">Fan Experience</p>
          </button>
        </div>
      </div>
    </div>
  )
}
