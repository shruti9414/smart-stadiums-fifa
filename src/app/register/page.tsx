'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { Universe3D } from '@/components/Universe3D'
import { LoginCard3D } from '@/components/LoginCard3D'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { UserPlus, AlertCircle, Loader, Shield, Smartphone, MapPin, Bell, Eye, EyeOff } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordMatch, setPasswordMatch] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handlePasswordChange = (value: string) => {
    setPassword(value)
    if (confirmPassword) {
      setPasswordMatch(value === confirmPassword)
    }
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value)
    setPasswordMatch(value === password)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!passwordMatch) {
      setError('Passwords do not match')
      return
    }

    if (!email || !password || !fullName) {
      setError('All fields are required')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Registration failed')
      }

      const data = await res.json()
      setAuth(data.data.user, data.data.token)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const visitorBenefits = [
    { icon: MapPin, label: 'Navigation', desc: 'Indoor wayfinding' },
    { icon: Bell, label: 'Alerts', desc: 'Real-time updates' },
    { icon: Smartphone, label: 'Access', desc: 'Full platform' },
  ]

  return (
    <div className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      {/* 3D Universe Background */}
      <Universe3D />

      {/* Animated gradient spheres */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
          }}
          transition={{ duration: 22, repeat: Infinity }}
          className="absolute top-1/3 left-1/3 w-96 h-96 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full blur-3xl opacity-20"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 28, repeat: Infinity }}
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-gradient-to-br from-teal-600 to-teal-800 rounded-full blur-3xl opacity-20"
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
        <div className="w-full max-w-6xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-white/10 hover:border-emerald-400/50 rounded-lg text-gray-300 hover:text-white transition-all duration-300 group"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Back to Login
            </Link>
          </motion.div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-1"
            >
              <LoginCard3D>
                <div className="relative p-8 rounded-2xl bg-gradient-to-br from-black via-black to-black/80 border border-white/10 backdrop-blur-2xl overflow-hidden group">
                  {/* Animated border glow */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 pointer-events-none" />

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Logo */}
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="mb-6 inline-flex p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl"
                    >
                      <UserPlus className="w-8 h-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-emerald-400 via-white to-cyan-400 text-transparent bg-clip-text">
                        Join Now
                      </h1>
                      <p className="text-gray-400 text-sm">Create your visitor account</p>
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
                      {/* Full Name */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">
                          👤 Full Name
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Your full name"
                          className="w-full px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-emerald-500/30 focus:border-emerald-500/60 rounded-xl text-white placeholder:text-gray-600 transition-all duration-300 outline-none group/input"
                          required
                        />
                        <div className="mt-2 h-1 w-0 group-focus-within/input:w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" />
                      </motion.div>

                      {/* Email */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">
                          📧 Email
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@email.com"
                          className="w-full px-5 py-3 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-emerald-500/30 focus:border-emerald-500/60 rounded-xl text-white placeholder:text-gray-600 transition-all duration-300 outline-none group/input"
                          required
                        />
                        <div className="mt-2 h-1 w-0 group-focus-within/input:w-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500" />
                      </motion.div>

                      {/* Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label className="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">
                          🔐 Password
                        </label>
                        <div className="relative group/input">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => handlePasswordChange(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-5 py-3 pr-12 bg-white/5 backdrop-blur-xl border border-white/20 hover:border-teal-500/30 focus:border-teal-500/60 rounded-xl text-white placeholder:text-gray-600 transition-all duration-300 outline-none"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                          >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">Minimum 6 characters</p>
                      </motion.div>

                      {/* Confirm Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                      >
                        <label className="block text-xs font-bold text-gray-300 mb-3 uppercase tracking-wider">
                          ✓ Confirm Password
                        </label>
                        <div className="relative group/input">
                          <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                            placeholder="••••••••"
                            className={`w-full px-5 py-3 pr-12 bg-white/5 backdrop-blur-xl border transition-all duration-300 rounded-xl text-white placeholder:text-gray-600 outline-none ${
                              confirmPassword && !passwordMatch
                                ? 'border-red-500/60 hover:border-red-500/80'
                                : 'border-white/20 hover:border-teal-500/30 focus:border-teal-500/60'
                            }`}
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-400 transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                        {confirmPassword && !passwordMatch && (
                          <p className="text-xs text-red-400 mt-2">❌ Passwords do not match</p>
                        )}
                        {confirmPassword && passwordMatch && (
                          <p className="text-xs text-emerald-400 mt-2">✓ Passwords match</p>
                        )}
                      </motion.div>

                      {/* Button */}
                      <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || Boolean(confirmPassword && !passwordMatch)}
                        className="w-full mt-8 py-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:to-cyan-600 disabled:opacity-50 text-white font-black rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group hover:shadow-2xl hover:shadow-emerald-500/50"
                      >
                        {loading ? (
                          <>
                            <Loader className="w-5 h-5 animate-spin" />
                            CREATING ACCOUNT...
                          </>
                        ) : (
                          <>
                            CREATE ACCOUNT
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                          </>
                        )}
                      </motion.button>
                    </form>

                    {/* Sign In Link */}
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="mt-6 text-center text-sm text-gray-400"
                    >
                      Already have an account?{' '}
                      <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-bold transition-colors">
                        Sign in
                      </Link>
                    </motion.p>
                  </div>
                </div>
              </LoginCard3D>
            </motion.div>

            {/* Right Columns: Visitor Benefits */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2 space-y-8"
            >
              {/* Benefits Title */}
              <div>
                <h2 className="text-4xl font-black mb-3">
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-transparent bg-clip-text">
                    Visitor Benefits
                  </span>
                </h2>
                <p className="text-gray-400 text-lg">Access exclusive features for match day</p>
              </div>

              {/* Benefits Cards */}
              <div className="space-y-5">
                {visitorBenefits.map((benefit, idx) => {
                  const Icon = benefit.icon
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      whileHover={{ scale: 1.02, x: 10 }}
                      className="group p-6 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 hover:border-emerald-400/60 backdrop-blur-xl transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-black text-white text-lg mb-1">{benefit.label}</h3>
                          <p className="text-gray-300 text-sm">{benefit.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Features List */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="p-6 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/20 rounded-2xl backdrop-blur-xl"
              >
                <h3 className="font-black text-white mb-4">What You'll Get:</h3>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Real-time crowd occupancy heatmaps</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>AI-powered navigation & wayfinding</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Queue wait time predictions</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Accessibility & facility information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Multi-language support (5 languages)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>Push notifications for important alerts</span>
                  </li>
                </ul>
              </motion.div>

              {/* Security Note */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
                className="p-6 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl backdrop-blur-xl flex gap-3"
              >
                <Shield className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white mb-1">🔒 Your data is secure</p>
                  <p className="text-gray-300 text-sm">
                    Enterprise-grade security with bcrypt password hashing and JWT authentication.
                  </p>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
