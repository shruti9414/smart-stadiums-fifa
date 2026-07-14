'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { redirect } from 'next/navigation'

const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('auth_token'))
    }
  }, [])
  return { token }
}

const InteractiveNavigationMap = dynamic(() => import('@/components/InteractiveNavigationMap').then(mod => ({ default: mod.InteractiveNavigationMap })), { ssr: false })

interface Destination {
  id: string
  name: string
  type: string
  category: string
  distance: number
}

const destinations: Destination[] = [
  { id: '1', name: 'Gate A', type: 'gate', category: 'Entry/Exit', distance: 250 },
  { id: '2', name: 'Medical Center', type: 'medical', category: 'Services', distance: 450 },
  { id: '3', name: 'Restroom', type: 'restroom', category: 'Facilities', distance: 320 },
  { id: '4', name: 'Food Court', type: 'food', category: 'Dining', distance: 380 },
  { id: '5', name: 'VIP Lounge', type: 'vip', category: 'Premium', distance: 520 },
  { id: '6', name: 'North Emergency Exit', type: 'exit', category: 'Emergency', distance: 180 },
]

export default function NavigatePage() {
  const { token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(destinations[0])
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredDestinations = destinations.filter(d =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold gradient-text">🗺️ Navigation</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time stadium navigation & routing</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Destinations */}
          <motion.div
            className="lg:col-span-1 space-y-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            {/* Search */}
            <div className="backdrop-blur-2xl bg-gradient-to-br from-slate-900/90 to-black/90 border border-blue-500/30 rounded-2xl p-4">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50 focus:bg-slate-800"
              />
            </div>

            {/* Destinations List */}
            <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
              {filteredDestinations.map((dest, idx) => (
                <motion.button
                  key={dest.id}
                  onClick={() => setSelectedDestination(dest)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedDestination?.id === dest.id
                      ? 'backdrop-blur-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50'
                      : 'backdrop-blur-xl bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {dest.type === 'gate' && '🚪'}
                      {dest.type === 'medical' && '🏥'}
                      {dest.type === 'restroom' && '🚻'}
                      {dest.type === 'food' && '🍽️'}
                      {dest.type === 'vip' && '👑'}
                      {dest.type === 'exit' && '⚠️'}
                    </span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{dest.name}</p>
                      <p className="text-xs text-slate-400">{dest.category} • {dest.distance}m away</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Route Info Card */}
            {selectedDestination && (
              <motion.div
                className="backdrop-blur-2xl bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h3 className="text-sm font-bold text-emerald-300 mb-3">📍 Route Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Distance</span>
                    <span className="text-emerald-300 font-bold">{selectedDestination.distance}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Est. Walk Time</span>
                    <span className="text-cyan-300 font-bold">{Math.ceil(selectedDestination.distance / 150)} min</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Accessibility</span>
                    <span className="text-blue-300 font-bold">Level 2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Current Wait</span>
                    <span className="text-yellow-300 font-bold">~8 min</span>
                  </div>
                </div>

                <button className="w-full mt-4 py-2 px-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all text-sm">
                  Start Navigation
                </button>
              </motion.div>
            )}
          </motion.div>

          {/* Right Panel - Map */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl backdrop-blur-sm h-[600px]">
              <InteractiveNavigationMap
                destination={selectedDestination?.name}
                userLocation={{ lat: 40.7128, lng: -74.0060 }}
              />
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats */}
        <motion.div
          className="grid grid-cols-4 gap-4 mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsCard label="📊 Crowd Zones" value="4" description="High density areas" />
          <StatsCard label="🚪 Entry Gates" value="8" description="All accessible" />
          <StatsCard label="🏥 Medical" value="3" description="Stations available" />
          <StatsCard label="♿ Accessible Routes" value="12" description="Mapped & optimized" />
        </motion.div>
      </main>
    </div>
  )
}

function StatsCard({
  label,
  value,
  description,
}: {
  label: string
  value: string
  description: string
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-5 hover:border-slate-600/50 hover:bg-slate-900/80 transition-all duration-300 group">
      <p className="text-sm text-slate-400 mb-2 group-hover:text-slate-300 transition-colors">{label}</p>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  )
}
