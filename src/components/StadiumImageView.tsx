'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface StadiumImageViewProps {
  occupancy: number
}

export function StadiumImageView({ occupancy }: StadiumImageViewProps) {
  const [mounted, setMounted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  if (!mounted) return null

  return (
    <div
      className="relative w-full h-full overflow-hidden bg-black"
      onMouseMove={handleMouseMove}
      style={{
        perspective: '1000px',
      }}
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 opacity-100"
        animate={{
          background: [
            'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
            'linear-gradient(135deg, #1e293b 0%, #334155 50%, #1e293b 100%)',
            'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity }}
      />

      {/* Animated light orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full blur-3xl opacity-20"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-600 to-blue-500 rounded-full blur-3xl opacity-15"
        animate={{
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity }}
      />

      {/* Main stadium container with 3D effect */}
      <div className="relative w-full h-full flex flex-col items-center justify-center z-10">
        {/* Top section with stats */}
        <motion.div
          className="w-full pt-8 px-8"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="max-w-6xl mx-auto flex justify-between items-start">
            {/* Left stats */}
            <div className="space-y-4">
              <motion.h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400">
                FIFA 2026 Stadium
              </motion.h2>
              <p className="text-slate-300 text-lg">Real-time Operations Dashboard</p>
            </div>

            {/* Right quick stats */}
            <div className="grid grid-cols-3 gap-4">
              <motion.div
                className="backdrop-blur-xl bg-black/50 border border-blue-500/30 rounded-xl p-4"
                whileHover={{ scale: 1.05, borderColor: '#0ea5e9' }}
              >
                <p className="text-xs text-slate-400 mb-1">Live Visitors</p>
                <p className="text-2xl font-bold text-blue-300">8,234</p>
              </motion.div>
              <motion.div
                className="backdrop-blur-xl bg-black/50 border border-cyan-500/30 rounded-xl p-4"
                whileHover={{ scale: 1.05, borderColor: '#06b6d4' }}
              >
                <p className="text-xs text-slate-400 mb-1">Temperature</p>
                <p className="text-2xl font-bold text-cyan-300">22°C</p>
              </motion.div>
              <motion.div
                className="backdrop-blur-xl bg-black/50 border border-green-500/30 rounded-xl p-4"
                whileHover={{ scale: 1.05, borderColor: '#10b981' }}
              >
                <p className="text-xs text-slate-400 mb-1">Status</p>
                <p className="text-2xl font-bold text-green-300">Operational</p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Stadium Image - 3D styled */}
        <motion.div
          className="relative flex-1 flex items-center justify-center w-full px-8 py-4"
          style={{
            transformStyle: 'preserve-3d',
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          {/* 3D frame effect */}
          <div
            className="relative w-full max-w-3xl h-64 rounded-3xl overflow-hidden shadow-2xl"
            style={{
              boxShadow: `
                0 0 60px rgba(59, 130, 246, 0.3),
                inset 0 0 30px rgba(59, 130, 246, 0.1),
                0 25px 50px -12px rgba(0, 0, 0, 0.5)
              `,
              transform: `
                rotateX(${mousePosition.y * 5 - 2.5}deg)
                rotateY(${mousePosition.x * 5 - 2.5}deg)
                translateZ(0)
              `,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {/* Outer glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-black/10 rounded-3xl pointer-events-none" />

            {/* Stadium Image */}
            <div className="relative w-full h-full">
              <Image
                src="/stadium.png"
                alt="FIFA 2026 Stadium"
                fill
                className="object-cover"
                priority
              />

              {/* Overlay gradient */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
                animate={{ opacity: [0.4, 0.6, 0.4] }}
                transition={{ duration: 4, repeat: Infinity }}
              />
            </div>

            {/* Border glow effect */}
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-transparent bg-gradient-to-r from-blue-500/50 via-cyan-500/50 to-blue-500/50 pointer-events-none"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                  '0 0 40px rgba(6, 182, 212, 0.5)',
                  '0 0 20px rgba(59, 130, 246, 0.5)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
        </motion.div>

        {/* Bottom section - Occupancy & Controls */}
        <motion.div
          className="w-full pb-8 px-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="max-w-6xl mx-auto">
            {/* Main occupancy bar */}
            <div className="backdrop-blur-xl bg-gradient-to-r from-black/60 to-black/40 border border-blue-500/30 rounded-2xl p-8 mb-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <p className="text-slate-400 text-sm mb-2">Stadium Occupancy</p>
                  <motion.p
                    className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"
                    key={occupancy}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                  >
                    {Math.round(occupancy)}%
                  </motion.p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-sm">Capacity</p>
                  <p className="text-2xl font-bold text-slate-300">80,000</p>
                </div>
              </div>

              {/* Animated occupancy bar */}
              <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${occupancy}%` }}
                  transition={{ duration: 1 }}
                  style={{
                    boxShadow: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 10px rgba(6, 182, 212, 0.5)',
                  }}
                />
              </div>
            </div>

            {/* Zone status grid */}
            <div className="grid grid-cols-4 gap-4">
              {[
                { name: 'North Stand', occupancy: 72, status: 'Safe' },
                { name: 'South Stand', occupancy: 85, status: 'Caution' },
                { name: 'East Stand', occupancy: 92, status: 'Alert' },
                { name: 'West Stand', occupancy: 68, status: 'Safe' },
              ].map((zone, idx) => (
                <motion.div
                  key={idx}
                  className="backdrop-blur-xl bg-black/50 border border-slate-700/50 rounded-xl p-4 hover:border-blue-500/50 transition-all"
                  whileHover={{ scale: 1.05, y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <p className="text-sm font-semibold text-white mb-2">{zone.name}</p>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden mb-2">
                    <motion.div
                      className={`h-full ${
                        zone.occupancy > 85
                          ? 'bg-gradient-to-r from-red-600 to-orange-500'
                          : zone.occupancy > 70
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-500'
                          : 'bg-gradient-to-r from-green-600 to-cyan-500'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${zone.occupancy}%` }}
                      transition={{ duration: 1, delay: idx * 0.1 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{zone.occupancy}%</span>
                    <span
                      className={
                        zone.occupancy > 85
                          ? 'text-red-400'
                          : zone.occupancy > 70
                          ? 'text-yellow-400'
                          : 'text-green-400'
                      }
                    >
                      {zone.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
