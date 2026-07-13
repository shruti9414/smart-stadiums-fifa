'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap, Globe, Users, Shield, Cpu, TrendingUp } from 'lucide-react'

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

  const features = [
    { icon: Zap, label: 'Real-time Analytics', desc: 'Live crowd monitoring' },
    { icon: Globe, label: 'Global Scale', desc: '80,000 capacity management' },
    { icon: Users, label: 'Multi-role', desc: 'Admin, Staff, Visitor' },
    { icon: Shield, label: 'Secure', desc: 'Enterprise-grade security' },
    { icon: Cpu, label: 'AI-Powered', desc: 'Gemini AI integration' },
    { icon: TrendingUp, label: 'Predictive', desc: 'Crowd forecasting' },
  ]

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Radial gradient overlays */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main content */}
      <motion.div
        className="relative z-10 max-w-6xl mx-auto px-6 py-20 text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Badge */}
        <motion.div variants={itemVariants} className="mb-6">
          <span className="inline-block px-4 py-2 bg-gradient-to-r from-red-500/20 to-cyan-500/20 border border-red-500/30 rounded-full text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-cyan-400">
            🏆 FIFA World Cup 2026 Stadium Operations
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-black mb-6 tracking-tight"
        >
          <span className="bg-gradient-to-r from-white via-cyan-300 to-red-400 text-transparent bg-clip-text">
            Smart Stadiums
          </span>
          <br />
          <span className="text-3xl md:text-5xl text-cyan-400">
            Next-Gen Operations Platform
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
        >
          AI-powered crowd management, real-time analytics, and intelligent operations for the world's largest stadiums.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Link
            href="/login"
            className="group relative px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2 justify-center">
              Get Started <Zap size={20} />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <Link
            href="/login"
            className="px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 hover:border-cyan-400/50 text-white font-bold rounded-lg transition-all duration-300 hover:bg-white/20"
          >
            Sign In
          </Link>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
        >
          {features.map((feature, idx) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group p-6 bg-white/5 backdrop-blur-md border border-white/10 hover:border-cyan-400/50 rounded-xl transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-red-400 mb-3 group-hover:text-cyan-400 transition-colors" />
                <h3 className="text-white font-bold mb-1">{feature.label}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-3 gap-6 mt-20 pt-20 border-t border-white/10"
        >
          <div>
            <p className="text-3xl md:text-4xl font-black text-red-400">80,000</p>
            <p className="text-gray-400 text-sm mt-2">Stadium Capacity</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-cyan-400">99.9%</p>
            <p className="text-gray-400 text-sm mt-2">Platform Score</p>
          </div>
          <div>
            <p className="text-3xl md:text-4xl font-black text-yellow-400">5 Languages</p>
            <p className="text-gray-400 text-sm mt-2">Global Support</p>
          </div>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="relative z-10 mt-20 text-center text-gray-500 text-sm pb-10"
      >
        <p>Built with ❤️ for FIFA World Cup 2026</p>
      </motion.div>
    </div>
  )
}
