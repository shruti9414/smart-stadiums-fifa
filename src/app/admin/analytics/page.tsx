'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { redirect } from 'next/navigation'

// Auth check without useAuth hook (causes build issues on Vercel)
const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    setToken(savedToken)
  }, [])
  return { token }
}

interface Zone {
  name: string
  occupancy: number
  capacity: number
  status: 'safe' | 'caution' | 'alert'
  temperature: number
}

export default function AnalyticsPage() {
  const { token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [occupancy, setOccupancy] = useState(65.5)
  const [zones, setZones] = useState<Zone[]>([
    { name: 'North Stand', occupancy: 72, capacity: 10000, status: 'safe', temperature: 22 },
    { name: 'South Stand', occupancy: 85, capacity: 12000, status: 'caution', temperature: 24 },
    { name: 'East Stand', occupancy: 92, capacity: 8000, status: 'alert', temperature: 26 },
    { name: 'West Stand', occupancy: 68, capacity: 9000, status: 'safe', temperature: 21 },
    { name: 'VIP Seating', occupancy: 45, capacity: 2000, status: 'safe', temperature: 20 },
    { name: 'Standing Area', occupancy: 78, capacity: 5000, status: 'caution', temperature: 25 },
  ])
  const [timeRange, setTimeRange] = useState('1h')

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const savedToken = localStorage.getItem('auth_token')
      if (!savedToken && !token) {
        redirect('/login')
      }
      setIsChecking(false)
    }, 50)
    return () => clearTimeout(checkAuth)
  }, [token])

  if (isChecking) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold gradient-text">📊 Analytics</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time stadium analytics & crowd monitoring</p>
          </div>
          <div className="flex gap-2">
            {['1h', '6h', '24h'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  timeRange === range
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                    : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600/50'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Heatmap Section */}
        <motion.div
          className="rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="h-80 bg-black/80">
            {/* Heatmap Component - Disabled for build compatibility */}
            <div className="w-full h-64 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold">
              Crowd Occupancy: {occupancy.toFixed(1)}%
            </div>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            label="Total Occupancy"
            value={`${Math.round(occupancy)}%`}
            subtext="52,340 visitors"
            icon="👥"
            trend="↑ 2.5%"
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            label="Avg Temperature"
            value="23°C"
            subtext="Optimal range"
            icon="🌡️"
            trend="✓ Normal"
            color="from-green-500 to-emerald-500"
          />
          <StatCard
            label="Alert Zones"
            value="1"
            subtext="East Stand"
            icon="⚠️"
            trend="↑ 1"
            color="from-red-500 to-orange-500"
          />
          <StatCard
            label="Safety Index"
            value="94%"
            subtext="All systems nominal"
            icon="✓"
            trend="Secure"
            color="from-purple-500 to-pink-500"
          />
        </motion.div>

        {/* Zone Details */}
        <motion.div
          className="rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">📍 Zone Analytics</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {zones.map((zone, idx) => {
              const capacity = zone.occupancy / zone.capacity * 100
              return (
                <motion.div
                  key={zone.name}
                  className={`rounded-xl border p-6 backdrop-blur-sm transition-all ${
                    zone.status === 'safe'
                      ? 'border-green-500/30 bg-green-500/5 hover:border-green-500/50'
                      : zone.status === 'caution'
                      ? 'border-yellow-500/30 bg-yellow-500/5 hover:border-yellow-500/50'
                      : 'border-red-500/30 bg-red-500/5 hover:border-red-500/50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-white mb-1">{zone.name}</h3>
                      <p className={`text-sm font-semibold ${
                        zone.status === 'safe'
                          ? 'text-green-400'
                          : zone.status === 'caution'
                          ? 'text-yellow-400'
                          : 'text-red-400'
                      }`}>
                        {zone.status === 'safe' && '✓ Safe'}
                        {zone.status === 'caution' && '⚡ Caution'}
                        {zone.status === 'alert' && '🚨 Alert'}
                      </p>
                    </div>
                    <span className="text-2xl">
                      {zone.occupancy > 80 ? '🔥' : zone.occupancy > 50 ? '⚡' : '✓'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {/* Occupancy bar */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs text-slate-400">Occupancy</span>
                        <span className="text-sm font-bold text-white">{zone.occupancy}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                          className={`h-full rounded-full transition-all ${
                            zone.occupancy > 80
                              ? 'bg-gradient-to-r from-red-600 to-orange-500'
                              : zone.occupancy > 50
                              ? 'bg-gradient-to-r from-yellow-600 to-orange-500'
                              : 'bg-gradient-to-r from-green-600 to-cyan-500'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${zone.occupancy}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    {/* Visitor count */}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Visitors</span>
                      <span className="text-white font-semibold">
                        {Math.round((zone.occupancy / 100) * zone.capacity).toLocaleString()}
                      </span>
                    </div>

                    {/* Temperature */}
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Temperature</span>
                      <span className={`font-semibold ${
                        zone.temperature > 25 ? 'text-orange-400' : zone.temperature > 22 ? 'text-yellow-400' : 'text-green-400'
                      }`}>
                        {zone.temperature}°C
                      </span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Incident Hotspots */}
        <motion.div
          className="rounded-3xl border border-slate-700/50 overflow-hidden shadow-2xl backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Incident Hotspots - Disabled for build compatibility */}
          <div className="w-full h-64 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl flex items-center justify-center text-white font-bold">
            Incident Hotspots Map
          </div>
        </motion.div>

        {/* Real-time Trends Chart */}
        <motion.div
          className="rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-white mb-6">📈 Occupancy Trend</h2>
          <div className="grid grid-cols-12 gap-1 h-40 items-end">
            {Array.from({ length: 12 }).map((_, i) => {
              const value = 30 + Math.sin(i * 0.5) * 30 + Math.random() * 20
              const barHeight = (value / 80) * 100
              const barColor = value > 70 ? 'from-red-600 to-orange-500' : value > 50 ? 'from-yellow-600 to-orange-500' : 'from-green-600 to-cyan-500'
              return (
                <motion.div
                  key={i}
                  className={`flex-1 bg-gradient-to-t ${barColor} rounded-t-sm hover:brightness-110 transition-all cursor-pointer group relative`}
                  initial={{ height: 0 }}
                  animate={{ height: `${barHeight}%` }}
                  transition={{ delay: i * 0.03, duration: 0.8 }}
                >
                  <motion.div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {Math.round(value)}%
                  </motion.div>
                </motion.div>
              )
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-slate-400">
            <span>12:00 AM</span>
            <span>3:00 AM</span>
            <span>6:00 AM</span>
            <span>9:00 AM</span>
          </div>
        </motion.div>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  subtext,
  icon,
  trend,
  color,
}: {
  label: string
  value: string
  subtext: string
  icon: string
  trend: string
  color: string
}) {
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${color} border-current/30 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative`}>
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold opacity-90">{label}</p>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-black mb-2">{value}</p>
        <p className="text-xs opacity-80 mb-2">{subtext}</p>
        <p className="text-xs font-semibold text-white/80">{trend}</p>
      </div>
    </div>
  )
}
