'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Universe3D } from '@/components/Universe3D'
import { LoginCard3D } from '@/components/LoginCard3D'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { LogIn, AlertCircle, Loader, Shield, Zap } from 'lucide-react'

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
      icon: '⚙️',
      label: 'Operations Admin',
      email: 'admin@stadium.com',
      password: 'Admin@12345',
      gradient: 'from-red-600 via-red-500 to-orange-500',
      glowColor: 'shadow-red-500/50',
      accentColor: 'text-red-400',
      borderColor: 'border-red-500/50',
      bgColor: 'bg-red-500/10',
      description: '🏛️ Command Center',
    },
    {
      role: 'staff' as const,
      icon: '🚀',
      label: 'Security Team',
      email: 'staff@stadium.com',
      password: 'Staff@12345',
      gradient: 'from-cyan-600 via-cyan-500 to-blue-500',
      glowColor: 'shadow-cyan-500/50',
      accentColor: 'text-cyan-400',
      borderColor: 'border-cyan-500/50',
      bgColor: 'bg-cyan-500/10',
      description: '🛡️ Quick Response',
    },
    {
      role: 'visitor' as const,
      icon: '🎯',
      label: 'Visitor Access',
      email: 'visitor@stadium.com',
      password: 'Visitor@12345',
      gradient: 'from-emerald-600 via-emerald-500 to-teal-500',
      glowColor: 'shadow-emerald-500/50',
      accentColor: 'text-emerald-400',
      borderColor: 'border-emerald-500/50',
      bgColor: 'bg-emerald-500/10',
      description: '👥 Fan Portal',
    },
  ]

  const fillDemoAccount = (account: typeof demoAccounts[0]) => {
    setEmail(account.email)
    setPassword(account.password)
    setSelectedRole(account.role)
  }

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* 3D Universe Background */}
      <Universe3D />

      {/* Animated gradient spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-br from-red-600 to-red-800 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-cyan-600 to-cyan-800 rounded-full blur-3xl opacity-20"
        />
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-transparent to-black/40 pointer-events-none" />
      </div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12"
      >
        <div className="w-full max-w-7xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-cyan-400/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to Home
            </Link>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <LoginCard3D>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-black via-black to-black/80 border border-white/10 backdrop-blur-2xl overflow-hidden group">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-red-500 via-cyan-500 to-yellow-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Logo */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="mb-6 inline-flex p-3 bg-gradient-to-br from-red-500 to-cyan-500 rounded-xl"
                    >
                      <LogIn className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-red-400 via-white to-cyan-400 text-transparent bg-clip-text">
                        Access
                      </h1>
                      <p className="text-gray-400 text-sm">FIFA 2026 Operations</p>
                    </motion.div>

                    {/* Error */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                        <p className="text-red-200 text-sm">{error}</p>
                      </motion.div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                      {/* Email */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">
                          📧 Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@stadium.com"
                          className="w-full px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-red-500/30 focus:border-red-500/60 rounded-xl text-white placeholder:text-gray-600 transition-all duration-300 outline-none group/input"
                          required
                        />
                        <div className="mt-2 h-1 w-0 group-focus-within/input:w-full bg-gradient-to-r from-red-500 to-cyan-500 rounded-full transition-all duration-500" />
                      </motion.div>

                      {/* Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">
                          🔐 Password
                        </label>
                        <input
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-cyan-500/30 focus:border-cyan-500/60 rounded-xl text-white placeholder:text-gray-600 transition-all duration-300 outline-none group/input"
                          required
                        />
                        <div className="mt-2 h-1 w-0 group-focus-within/input:w-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500" />
                      </motion.div>

                      {/* Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full mt-8 py-3 bg-gradient-to-r from-red-500 via-red-600 to-orange-500 hover:from-red-600 hover:to-orange-600 disabled:opacity-50 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-2xl hover:shadow-red-500/50"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            SIGNING IN...
                          </>
                        ) : (
                          <>
                            SIGN IN
                            <span className="group-hover:translate-x-1 transition-transform">
                              <Zap size={18} />
                            </span>
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Register - Only for Visitors */}
                    {(selectedRole === null || selectedRole === 'visitor') && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mt-6 text-center text-sm text-gray-400"
                      >
                        👤 Visitors:{' '}
                        <Link href="/register" className="text-cyan-400 hover:text-cyan-300 font-bold transition-colors">
                          Create one
                        </Link>
                      </motion.p>
                    )}
                  </div>
                </div>
              </LoginCard3D>
            </motion.div>

            {/* Right Columns: Demo Accounts */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Title */}
              <div>
                <h2 className="text-4xl font-black mb-2">
                  <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-cyan-400 text-transparent bg-clip-text">
                    Quick Demo
                  </span>
                </h2>
                <p className="text-gray-400">Click any role to auto-fill credentials</p>
              </div>

              {/* Demo Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {demoAccounts.map((account, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + idx * 0.15 }}
                    whileHover={{ scale: 1.05, rotateZ: 2 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => fillDemoAccount(account)}
                    className={`group relative h-full p-6 rounded-2xl bg-gradient-to-br ${account.gradient} overflow-hidden transition-all duration-500 cursor-pointer`}
                  >
                    {/* Card background */}
                    <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-all duration-500" />
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${account.glowColor} blur-2xl`} />

                    {/* Border glow */}
                    <div className={`absolute inset-0 rounded-2xl border border-white/20 group-hover:${account.borderColor} transition-all duration-500`} />

                    {/* Content */}
                    <div className="relative z-10 h-full flex flex-col">
                      {/* Icon */}
                      <motion.div
                        animate={{
                          y: [0, -10, 0],
                        }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: idx * 0.2,
                        }}
                        className="text-5xl mb-4"
                      >
                        {account.icon}
                      </motion.div>

                      {/* Title */}
                      <h3 className="text-xl font-black text-white mb-1">{account.label}</h3>
                      <p className={`text-sm font-bold ${account.accentColor} mb-4`}>{account.description}</p>

                      {/* Divider */}
                      <div className="flex-grow" />
                      <div className={`h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-4`} />

                      {/* Credentials */}
                      <div className="space-y-2 text-xs text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Email:</span>
                          <code className="font-mono text-white/80">{account.email}</code>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Pass:</span>
                          <code className="font-mono text-white/80">{account.password}</code>
                        </div>
                      </div>

                      {/* CTA */}
                      <motion.div
                        className="mt-4 pt-4 border-t border-white/10 text-white font-bold flex items-center gap-2 group-hover:translate-x-1 transition-transform"
                      >
                        Click to Fill <span className="ml-auto">→</span>
                      </motion.div>
                    </div>
                  </motion.button>
                ))}
              </div>

              {/* Info Box */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="p-6 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl backdrop-blur-xl"
              >
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white mb-1">🔐 Security Note</p>
                    <p className="text-gray-300 text-sm">
                      All demo credentials are hardcoded for testing. In production, use secure authentication methods.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
