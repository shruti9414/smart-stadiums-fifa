'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Universe3D } from '@/components/Universe3D'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogIn, AlertCircle, Loader } from 'lucide-react'

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

  const demoAccounts = [
    {
      role: 'admin' as const,
      icon: '👨‍💼',
      label: 'Admin',
      email: 'admin@stadium.com',
      password: 'Admin@12345',
      color: 'from-purple-500 to-purple-600',
      borderColor: 'border-purple-500/50',
      hoverColor: 'hover:bg-purple-500/20',
      description: 'Full Operations Control',
    },
    {
      role: 'staff' as const,
      icon: '🚨',
      label: 'Staff/Security',
      email: 'staff@stadium.com',
      password: 'Staff@12345',
      color: 'from-blue-500 to-blue-600',
      borderColor: 'border-blue-500/50',
      hoverColor: 'hover:bg-blue-500/20',
      description: 'Quick Response Team',
    },
    {
      role: 'visitor' as const,
      icon: '👤',
      label: 'Visitor',
      email: 'visitor@stadium.com',
      password: 'Visitor@12345',
      color: 'from-green-500 to-green-600',
      borderColor: 'border-green-500/50',
      hoverColor: 'hover:bg-green-500/20',
      description: 'Fan Experience Portal',
    },
  ]

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setSelectedRole(account.role)
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden flex items-center justify-center">
      {/* 3D Universe Background */}
      <Universe3D />

      {/* Gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md md:max-w-2xl mx-auto px-4 py-8"
      >
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          Back to Home
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left: Login Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="flex flex-col justify-center"
          >
            {/* Logo & Title */}
            <div className="mb-8">
              <div className="inline-block mb-4 p-3 bg-gradient-to-br from-red-500/20 to-cyan-500/20 rounded-xl border border-red-500/30">
                <LogIn className="w-8 h-8 text-red-400" />
              </div>
              <h1 className="text-5xl font-black mb-3">
                <span className="bg-gradient-to-r from-white to-cyan-300 text-transparent bg-clip-text">
                  Welcome
                </span>
              </h1>
              <p className="text-gray-400 text-lg">Enter your credentials to continue</p>
            </div>

            {/* Error Alert */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-500/15 border border-red-500/50 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mb-8">
              {/* Email Input */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-2.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stadium.com"
                  className="w-full px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                  required
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-bold text-gray-200 mb-2.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/20 rounded-lg text-white placeholder:text-gray-500 focus:border-red-400 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 outline-none"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:opacity-50 text-white font-black rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-2xl hover:shadow-red-500/50"
              >
                {loading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </>
                )}
              </button>
            </form>

            {/* Register Link */}
            <p className="text-center text-gray-400">
              Don't have an account?{' '}
              <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                Create one
              </Link>
            </p>
          </motion.div>

          {/* Right: Demo Accounts */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6">
              <h2 className="text-2xl font-black mb-2">
                <span className="bg-gradient-to-r from-yellow-400 to-red-400 text-transparent bg-clip-text">
                  Demo Accounts
                </span>
              </h2>
              <p className="text-gray-400 text-sm">Click any to auto-fill credentials</p>
            </div>

            {/* Demo Account Cards */}
            <div className="space-y-4">
              {demoAccounts.map((account, idx) => (
                <motion.button
                  key={idx}
                  whileHover={{ scale: 1.02, y: -5 }}
                  onClick={() => fillDemoAccount(account)}
                  className={`w-full p-5 rounded-xl border-2 ${account.borderColor} bg-gradient-to-br ${account.color} bg-opacity-5 backdrop-blur-xl ${account.hoverColor} transition-all duration-300 text-left group`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-3xl">{account.icon}</span>
                    <span className="text-xs font-bold bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text uppercase tracking-wider">
                      Quick Login
                    </span>
                  </div>
                  <h3 className="font-bold text-white text-lg mb-1">{account.label}</h3>
                  <p className="text-sm text-gray-300 mb-2.5">{account.description}</p>
                  <div className="space-y-1 text-xs text-gray-400">
                    <p>
                      <span className="text-gray-500">Email:</span> {account.email}
                    </p>
                    <p>
                      <span className="text-gray-500">Password:</span> {account.password}
                    </p>
                  </div>
                  <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-300 group-hover:translate-x-1 transition-transform">
                    Click to auto-fill →
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Info Box */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <p className="text-xs text-blue-300">
                💡 <span className="font-bold">Tip:</span> Click any demo account card to auto-fill credentials, then click Sign In.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
