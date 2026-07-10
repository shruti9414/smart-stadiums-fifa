'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface StadiumOverlayProps {
  occupancy: number
}

interface POI {
  id: string
  name: string
  type: 'gate' | 'poi' | 'emergency'
  position: { x: number; y: number }
  status: 'normal' | 'warning' | 'alert'
  occupancy?: number
  visitors?: number
  waitTime?: string
  icon: string
}

const POI_MARKERS: POI[] = [
  {
    id: 'gate-a',
    name: 'Gate A - North Entrance',
    icon: '🚪',
    type: 'gate',
    position: { x: 25, y: 15 },
    status: 'normal',
    occupancy: 45,
    visitors: 2400,
    waitTime: '2 min',
  },
  {
    id: 'gate-b',
    name: 'Gate B - East Entrance',
    icon: '🚪',
    type: 'gate',
    position: { x: 75, y: 25 },
    status: 'warning',
    occupancy: 78,
    visitors: 3100,
    waitTime: '8 min',
  },
  {
    id: 'gate-c',
    name: 'Gate C - South Entrance',
    icon: '🚪',
    type: 'gate',
    position: { x: 65, y: 80 },
    status: 'normal',
    occupancy: 52,
    visitors: 2800,
    waitTime: '3 min',
  },
  {
    id: 'gate-d',
    name: 'Gate D - West Entrance',
    icon: '🚪',
    type: 'gate',
    position: { x: 15, y: 70 },
    status: 'alert',
    occupancy: 88,
    visitors: 3500,
    waitTime: '12 min',
  },
  {
    id: 'medical',
    name: 'Medical Center',
    icon: '🏥',
    type: 'poi',
    position: { x: 50, y: 35 },
    status: 'normal',
    occupancy: 15,
  },
  {
    id: 'parking',
    name: 'Parking - Lot A',
    icon: '🅿️',
    type: 'poi',
    position: { x: 20, y: 45 },
    status: 'warning',
    occupancy: 75,
  },
  {
    id: 'food',
    name: 'Food Court Level 2',
    icon: '🍽️',
    type: 'poi',
    position: { x: 80, y: 55 },
    status: 'normal',
    occupancy: 60,
  },
  {
    id: 'washroom',
    name: 'Washroom Facilities',
    icon: '🚻',
    type: 'poi',
    position: { x: 40, y: 65 },
    status: 'normal',
    occupancy: 30,
  },
  {
    id: 'accessibility',
    name: 'Accessibility Zone',
    icon: '♿',
    type: 'poi',
    position: { x: 50, y: 75 },
    status: 'normal',
    occupancy: 10,
  },
  {
    id: 'emergency-exit',
    name: 'Emergency Exit North',
    icon: '⚠️',
    type: 'emergency',
    position: { x: 30, y: 10 },
    status: 'normal',
  },
]

export function StadiumDigitalTwin({ occupancy }: StadiumOverlayProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredPOI, setHoveredPOI] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return { bg: 'from-green-500 to-emerald-600', glow: 'green', text: 'text-green-300' }
      case 'warning':
        return { bg: 'from-yellow-500 to-amber-600', glow: 'yellow', text: 'text-yellow-300' }
      case 'alert':
        return { bg: 'from-red-500 to-rose-600', glow: 'red', text: 'text-red-300' }
      default:
        return { bg: 'from-blue-500 to-cyan-600', glow: 'blue', text: 'text-blue-300' }
    }
  }

  const getHeatmapColor = (occ: number) => {
    if (occ > 80) return 'rgba(239, 68, 68, 0.4)'
    if (occ > 60) return 'rgba(251, 146, 60, 0.4)'
    return 'rgba(34, 197, 94, 0.4)'
  }

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Animated background grid */}
      <svg className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="none">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(59, 130, 246, 0.5)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* Animated scanning line */}
      <motion.div
        className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-30"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      {/* Main stadium image container */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Stadium Image */}
        <motion.div
          className="relative w-full h-full"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <Image
            src="/stadium.png"
            alt="Stadium Digital Twin"
            fill
            className="object-cover"
            priority
          />

          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

          {/* Heatmap overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${getHeatmapColor(occupancy)} 0%, transparent 70%)`,
            }}
            animate={{ opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* POI Markers */}
          {POI_MARKERS.map((poi) => {
            const colors = getStatusColor(poi.status)
            const isHovered = hoveredPOI === poi.id

            return (
              <motion.div
                key={poi.id}
                className="absolute cursor-pointer group"
                style={{
                  left: `${poi.position.x}%`,
                  top: `${poi.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onMouseEnter={() => setHoveredPOI(poi.id)}
                onMouseLeave={() => setHoveredPOI(null)}
                whileHover={{ scale: 1.2 }}
              >
                {/* Animated pulse ring */}
                <motion.div
                  className={`absolute inset-0 rounded-full border-2 border-${colors.glow}-400`}
                  style={{
                    width: '48px',
                    height: '48px',
                    left: '-24px',
                    top: '-24px',
                  }}
                  animate={{
                    scale: [1, 1.5],
                    opacity: [1, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Main marker */}
                <motion.div
                  className={`relative w-12 h-12 rounded-lg backdrop-blur-xl bg-gradient-to-br ${colors.bg} bg-opacity-80 border border-white/20 flex items-center justify-center shadow-2xl text-xl`}
                  animate={{
                    boxShadow: [
                      `0 0 20px rgba(${colors.glow === 'green' ? '34, 197, 94' : colors.glow === 'yellow' ? '251, 146, 60' : colors.glow === 'red' ? '239, 68, 68' : '59, 130, 246'}, 0.5)`,
                      `0 0 40px rgba(${colors.glow === 'green' ? '34, 197, 94' : colors.glow === 'yellow' ? '251, 146, 60' : colors.glow === 'red' ? '239, 68, 68' : '59, 130, 246'}, 0.8)`,
                      `0 0 20px rgba(${colors.glow === 'green' ? '34, 197, 94' : colors.glow === 'yellow' ? '251, 146, 60' : colors.glow === 'red' ? '239, 68, 68' : '59, 130, 246'}, 0.5)`,
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {poi.icon}
                </motion.div>

                {/* Status badge */}
                <motion.div
                  className={`absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gradient-to-br ${colors.bg} border border-white/30 flex items-center justify-center text-xs font-bold text-white`}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {poi.occupancy ? Math.round(poi.occupancy / 10) : '✓'}
                </motion.div>

                {/* Hover popup */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      className="absolute left-16 top-0 backdrop-blur-2xl bg-gradient-to-br from-slate-900/95 to-black/90 border border-cyan-500/50 rounded-xl p-4 w-64 z-50 shadow-2xl"
                      initial={{ opacity: 0, scale: 0.8, x: -10 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start gap-2">
                          <motion.div
                            className={`w-2 h-2 rounded-full bg-gradient-to-r ${colors.bg} flex-shrink-0 mt-1`}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                          <div>
                            <h3 className="text-sm font-bold text-white">{poi.name}</h3>
                            <p className={`text-xs ${colors.text}`}>{poi.status.toUpperCase()}</p>
                          </div>
                        </div>

                        {poi.type === 'gate' && (
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Occupancy</span>
                              <span className={colors.text}>{poi.occupancy}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Visitors</span>
                              <span className="text-blue-300">{poi.visitors?.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Wait Time</span>
                              <span className="text-cyan-300">{poi.waitTime}</span>
                            </div>
                            <div className="pt-2 border-t border-white/10">
                              <p className="text-xs text-slate-300">
                                📊 <span className="text-cyan-300">AI:</span> {poi.occupancy! > 80 ? 'Redirect to Gate C' : 'Optimal flow'}
                              </p>
                            </div>
                          </div>
                        )}

                        {poi.type === 'poi' && (
                          <div className="space-y-2 pt-2 border-t border-white/10">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Occupancy</span>
                              <span className={colors.text}>{poi.occupancy}%</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-400">Est. Wait</span>
                              <span className="text-cyan-300">{Math.round(poi.occupancy! * 0.3)} min</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}

          {/* Animated data points */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={`datapoint-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
              animate={{
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, (Math.random() - 0.5) * 200],
                opacity: [1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}

          {/* Navigation route SVG */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="1" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="1" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 25% 15% Q 50% 40%, 50% 75%"
              stroke="url(#routeGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="100"
              strokeDashoffset={100}
              animate={{ strokeDashoffset: [100, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Right Side Legend Panel */}
      <motion.div
        className="absolute right-4 top-4 bottom-4 w-72 backdrop-blur-2xl bg-gradient-to-b from-slate-900/90 to-black/90 border border-blue-500/30 rounded-2xl p-6 overflow-y-auto z-40"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <motion.div className="mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mb-2">
            Command Center
          </h3>
          <p className="text-xs text-slate-400">Real-time Stadium Intelligence</p>
        </motion.div>

        <div className="space-y-4">
          <motion.div
            className="backdrop-blur-xl bg-black/50 border border-cyan-500/30 rounded-xl p-4 hover:border-cyan-400/60 transition-all"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Crowd Density</span>
              <motion.span
                className="text-lg font-bold text-cyan-300"
                key={Math.round(occupancy)}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
              >
                {Math.round(occupancy)}%
              </motion.span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                initial={{ width: 0 }}
                animate={{ width: `${occupancy}%` }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">
              {occupancy > 80 ? '🔴 High Density' : occupancy > 60 ? '🟡 Moderate' : '🟢 Optimal'}
            </p>
          </motion.div>

          <motion.div
            className="backdrop-blur-xl bg-black/50 border border-blue-500/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h4 className="text-xs font-semibold text-slate-300 mb-3">Gate Status</h4>
            <div className="space-y-2">
              {['Gate A', 'Gate B', 'Gate C', 'Gate D'].map((gate, idx) => (
                <motion.div
                  key={gate}
                  className="flex items-center justify-between text-xs"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + idx * 0.05 }}
                >
                  <span className="text-slate-400">{gate}</span>
                  <motion.div
                    className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500"
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="backdrop-blur-xl bg-black/50 border border-amber-500/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-slate-300">Active Incidents</h4>
              <motion.span
                className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2 py-1 rounded"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                3
              </motion.span>
            </div>
            <div className="text-xs text-slate-400 space-y-1">
              <p>📍 Section A - Crowd surge</p>
              <p>🚑 Gate C - Medical assist</p>
              <p>⚠️ Zone D - Minor incident</p>
            </div>
          </motion.div>

          <motion.div
            className="backdrop-blur-xl bg-black/50 border border-green-500/30 rounded-xl p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300">Parking Available</span>
              <span className="text-lg font-bold text-green-300">34%</span>
            </div>
            <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: '34%' }}
                transition={{ duration: 1 }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2">Lot A: 45% | Lot B: 23% | Lot C: 12%</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Top Info Bar */}
      <motion.div
        className="absolute top-4 left-4 backdrop-blur-2xl bg-gradient-to-r from-slate-900/90 to-black/90 border border-blue-500/30 rounded-xl px-6 py-4 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xs text-slate-400 mb-1">STADIUM STATUS</p>
            <motion.p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
              OPERATIONAL
            </motion.p>
          </div>
          <div className="border-l border-slate-700/50 pl-6">
            <p className="text-xs text-slate-400 mb-1">LIVE VISITORS</p>
            <motion.p className="text-2xl font-bold text-blue-300">8,234</motion.p>
          </div>
          <div className="border-l border-slate-700/50 pl-6">
            <p className="text-xs text-slate-400 mb-1">AI MONITORING</p>
            <motion.div
              className="flex items-center gap-2"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <div className="w-2 h-2 rounded-full bg-green-400" />
              <span className="text-sm font-semibold text-green-300">ACTIVE</span>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
