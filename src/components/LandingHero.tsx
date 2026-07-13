'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Globe, Users, Shield, Cpu, TrendingUp, ArrowRight } from 'lucide-react'

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 1, ease: 'easeOut' },
    },
  }

  const features = [
    { icon: Zap, label: 'Real-time Analytics', desc: 'Live crowd monitoring & predictions' },
    { icon: Globe, label: 'Global Scale', desc: '80,000+ capacity management' },
    { icon: Users, label: 'Multi-role Platform', desc: 'Admin, Staff, Visitor access' },
    { icon: Shield, label: 'Enterprise Security', desc: 'JWT + bcrypt + OWASP' },
    { icon: Cpu, label: 'AI-Powered', desc: 'Google Gemini integration' },
    { icon: TrendingUp, label: 'Smart Predictions', desc: 'Crowd forecasting & alerts' },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-20">
      {/* Premium radial gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-red-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 right-1/3 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge - MUCH BIGGER */}
        <motion.div variants={itemVariants} className="mb-10">
          <div className="inline-block">
            <div className="px-6 py-3 bg-gradient-to-r from-red-500/30 via-yellow-500/20 to-cyan-500/30 border-2 border-red-500/50 rounded-full backdrop-blur-xl hover:border-red-400 transition-all duration-300 shadow-lg shadow-red-500/20">
              <span className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-300 via-yellow-300 to-cyan-300 flex items-center gap-2 justify-center">
                🏆 FIFA World Cup 2026 Stadium Operations
              </span>
            </div>
          </div>
        </motion.div>

        {/* Main Heading - MUCH BIGGER */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-6 tracking-tighter leading-tight">
            <span className="bg-gradient-to-r from-white via-red-300 to-cyan-400 text-transparent bg-clip-text drop-shadow-lg">
              Smart
            </span>
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-red-400 to-yellow-300 text-transparent bg-clip-text drop-shadow-lg">
              Stadiums
            </span>
          </h1>
          <p className="text-2xl md:text-4xl font-bold text-cyan-400 mt-4">
            Next-Gen Operations Platform
          </p>
        </motion.div>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-200 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          AI-powered crowd management, real-time analytics, and intelligent operations for the world's largest stadiums. Built for FIFA World Cup 2026.
        </motion.p>

        {/* CTA Buttons - BIGGER */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
          <Link
            href="/login"
            className="group relative px-10 py-5 bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-black text-lg rounded-xl overflow-hidden transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-red-500/50 flex items-center gap-3 justify-center"
          >
            <span className="relative z-10">
              Get Started Now
            </span>
            <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </Link>

          <Link
            href="/login"
            className="px-10 py-5 bg-white/10 backdrop-blur-xl border-2 border-white/20 hover:border-cyan-400 text-white font-bold text-lg rounded-xl transition-all duration-300 hover:bg-white/20 hover:shadow-2xl hover:shadow-cyan-500/30 transform hover:scale-105"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Features Grid - BIGGER */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-24"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8, scale: 1.05 }}
                className="group p-8 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 hover:border-cyan-400/80 rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-cyan-500/20 cursor-pointer"
              >
                <div className="mb-4 p-4 bg-gradient-to-br from-red-500/20 to-cyan-500/20 rounded-xl w-fit group-hover:scale-110 transition-transform">
                  <Icon className="w-8 h-8 text-red-400 group-hover:text-cyan-400 transition-colors" />
                </div>
                <h3 className="text-white font-black text-xl mb-2">{feature.label}</h3>
                <p className="text-gray-300 text-base leading-relaxed">{feature.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats Section - BIGGER */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-8 md:gap-12 mt-32 pt-16 border-t border-white/10"
        >
          <div className="group">
            <p className="text-5xl md:text-6xl font-black bg-gradient-to-r from-red-400 to-red-600 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              80K+
            </p>
            <p className="text-gray-300 text-lg mt-3 font-semibold">Stadium Capacity</p>
          </div>
          <div className="group">
            <p className="text-5xl md:text-6xl font-black bg-gradient-to-r from-cyan-400 to-blue-600 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              99.9%
            </p>
            <p className="text-gray-300 text-lg mt-3 font-semibold">Platform Score</p>
          </div>
          <div className="group">
            <p className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-400 to-orange-600 text-transparent bg-clip-text group-hover:scale-110 transition-transform">
              5 Lang
            </p>
            <p className="text-gray-300 text-lg mt-3 font-semibold">Global Support</p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-20 p-8 bg-gradient-to-r from-red-500/10 to-cyan-500/10 border border-white/10 rounded-2xl backdrop-blur-xl"
        >
          <p className="text-gray-200 text-lg font-semibold">
            ✨ Real Gemini AI • 🗄️ Live Database • 📡 Real-time Streaming • 🔐 Enterprise Security
          </p>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="relative z-10 mt-24 text-center text-gray-500 text-base pb-10"
      >
        <p>Built with ❤️ for FIFA World Cup 2026 • Championship Grade Platform</p>
      </motion.div>
    </div>
  )
}
