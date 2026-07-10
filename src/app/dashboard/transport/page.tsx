'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { redirect } from 'next/navigation'

interface TransportService {
  id: string
  name: string
  icon: string
  description: string
  locations: string[]
  availability: string
  features: string[]
  rating: number
  cost: string
}

export default function TransportPage() {
  const { token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [services, setServices] = useState<TransportService[]>([])
  const [selectedService, setSelectedService] = useState<TransportService | null>(null)
  const [showComingSoon, setShowComingSoon] = useState(false)

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

  useEffect(() => {
    const transportServices: TransportService[] = [
      {
        id: '1',
        name: 'Premium Parking Levels',
        icon: '🅿️',
        description: 'Multi-level secure parking facility with real-time space tracking',
        locations: ['Level 1', 'Level 2', 'Level 3', 'Level 4', 'Level 5'],
        availability: '245 spaces available',
        features: ['24/7 Security', 'CCTV Monitoring', 'Well-lit floors', 'Climate control'],
        rating: 4.8,
        cost: '$8/day',
      },
      {
        id: '2',
        name: 'EV Charging Stations',
        icon: '🔌',
        description: 'Fast-charging and standard EV charging stations throughout parking',
        locations: ['Level 1: 8 spaces', 'Level 2: 6 spaces', 'Level 3: 4 spaces'],
        availability: '18 stations total',
        features: ['DC Fast Charging', '7kW standard', 'App-based booking', 'Payment integrated'],
        rating: 4.9,
        cost: '₹10-30/charge',
      },
      {
        id: '3',
        name: 'Valet Service',
        icon: '🚗',
        description: 'Professional valet parking with vehicle tracking and insurance',
        locations: ['Main Entrance', 'VIP Area', 'Accessible Entry'],
        availability: '24/7 available',
        features: ['Professional drivers', 'GPS tracking', 'Insurance covered', 'Quick retrieval'],
        rating: 4.7,
        cost: '₹100-200',
      },
      {
        id: '4',
        name: 'Shuttle Service',
        icon: '🚐',
        description: 'Free internal shuttle connecting parking levels to stadium entrance',
        locations: ['All Parking Levels', 'Stadium Main Gate', 'VIP Entrance'],
        availability: 'Every 5 mins',
        features: ['Air-conditioned', 'Wheelchair accessible', 'Frequent service', 'Free for all'],
        rating: 4.6,
        cost: 'Free',
      },
      {
        id: '5',
        name: 'Accessible Transport',
        icon: '♿',
        description: 'Wheelchair-accessible vehicles and drop-off services',
        locations: ['Accessible Entrance', 'Medical Gate', 'VIP Area'],
        availability: '6 vehicles on-call',
        features: ['Wheelchair lifts', 'Trained operators', '24/7 available', 'Priority access'],
        rating: 4.9,
        cost: 'Free',
      },
      {
        id: '6',
        name: 'Bicycle Parking',
        icon: '🚲',
        description: 'Secure bicycle parking with repair station and lockers',
        locations: ['North Gate', 'South Gate', 'East Entrance'],
        availability: '150 spaces',
        features: ['Covered area', 'Repair tools', 'Lockers available', '24/7 security'],
        rating: 4.5,
        cost: 'Free',
      },
    ]
    setServices(transportServices)
    setSelectedService(transportServices[0])
  }, [])

  if (isChecking) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold gradient-text">🚗 Stadium Transport</h1>
            <p className="text-slate-400 text-sm mt-1">Parking, shuttles, and mobility services</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Services List */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-3">
              {services.map((service, idx) => (
                <motion.button
                  key={service.id}
                  onClick={() => setSelectedService(service)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedService?.id === service.id
                      ? 'backdrop-blur-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50'
                      : 'backdrop-blur-xl bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{service.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{service.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-xs text-slate-400">{service.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Service Details */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Stadium Map with Parking Visualization */}
            <div className="rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="h-80 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden flex items-center justify-center">
                {/* Stadium SVG Map */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Stadium boundary */}
                  <ellipse cx="50" cy="50" rx="45" ry="40" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.8" />

                  {/* Field */}
                  <ellipse cx="50" cy="50" rx="35" ry="30" fill="rgba(34, 197, 94, 0.15)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="0.5" />

                  {/* Parking Levels Layout */}
                  <g id="parking-visualization">
                    {/* Level indicators */}
                    <rect x="5" y="20" width="12" height="60" fill="rgba(96, 165, 250, 0.2)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" />
                    <rect x="83" y="20" width="12" height="60" fill="rgba(96, 165, 250, 0.2)" stroke="rgba(96, 165, 250, 0.5)" strokeWidth="0.5" />
                    <text x="11" y="25" fill="#60a5fa" fontSize="3" fontWeight="bold" textAnchor="middle">L1</text>
                    <text x="89" y="25" fill="#60a5fa" fontSize="3" fontWeight="bold" textAnchor="middle">L5</text>

                    {/* Valet area */}
                    {selectedService?.id === '3' && (
                      <>
                        <circle cx="15" cy="15" r="4" fill="rgba(168, 85, 247, 0.6)" stroke="rgba(216, 180, 254, 0.8)" strokeWidth="0.5" />
                        <circle cx="85" cy="15" r="4" fill="rgba(168, 85, 247, 0.6)" stroke="rgba(216, 180, 254, 0.8)" strokeWidth="0.5" />
                        <text x="15" y="22" fill="#a855f7" fontSize="2" fontWeight="bold" textAnchor="middle">Valet</text>
                      </>
                    )}

                    {/* Shuttle routes */}
                    {selectedService?.id === '4' && (
                      <>
                        <path d="M 11 50 L 50 50 L 89 50" stroke="rgba(249, 115, 22, 0.6)" strokeWidth="1" strokeDasharray="3,3" fill="none" />
                        <circle cx="11" cy="50" r="2" fill="#f97316" />
                        <circle cx="50" cy="50" r="2" fill="#f97316" />
                        <circle cx="89" cy="50" r="2" fill="#f97316" />
                      </>
                    )}

                    {/* EV Charging */}
                    {selectedService?.id === '2' && (
                      <>
                        <circle cx="20" cy="30" r="2.5" fill="rgba(34, 197, 94, 0.8)" stroke="rgba(74, 222, 128, 0.9)" strokeWidth="0.3" />
                        <circle cx="50" cy="30" r="2.5" fill="rgba(34, 197, 94, 0.8)" stroke="rgba(74, 222, 128, 0.9)" strokeWidth="0.3" />
                        <circle cx="80" cy="30" r="2.5" fill="rgba(34, 197, 94, 0.8)" stroke="rgba(74, 222, 128, 0.9)" strokeWidth="0.3" />
                        <text x="20" y="38" fill="#22c55e" fontSize="2" fontWeight="bold" textAnchor="middle">EV</text>
                        <text x="50" y="38" fill="#22c55e" fontSize="2" fontWeight="bold" textAnchor="middle">EV</text>
                        <text x="80" y="38" fill="#22c55e" fontSize="2" fontWeight="bold" textAnchor="middle">EV</text>
                      </>
                    )}

                    {/* Bicycle parking */}
                    {selectedService?.id === '6' && (
                      <>
                        <circle cx="15" cy="85" r="3" fill="rgba(59, 130, 246, 0.6)" stroke="rgba(147, 197, 253, 0.8)" strokeWidth="0.5" />
                        <circle cx="50" cy="85" r="3" fill="rgba(59, 130, 246, 0.6)" stroke="rgba(147, 197, 253, 0.8)" strokeWidth="0.5" />
                        <circle cx="85" cy="85" r="3" fill="rgba(59, 130, 246, 0.6)" stroke="rgba(147, 197, 253, 0.8)" strokeWidth="0.5" />
                      </>
                    )}

                    {/* Accessible areas */}
                    {selectedService?.id === '5' && (
                      <>
                        <path d="M 50 20 L 40 50 L 50 80 L 60 50 Z" fill="rgba(168, 85, 247, 0.3)" stroke="rgba(168, 85, 247, 0.8)" strokeWidth="0.5" />
                        <text x="50" y="52" fill="#a855f7" fontSize="3" fontWeight="bold" textAnchor="middle">♿</text>
                      </>
                    )}
                  </g>
                </svg>

                {/* Info Overlay */}
                <div className="absolute bottom-4 right-4 backdrop-blur-xl bg-black/80 border border-slate-700/50 rounded-lg p-3 text-xs">
                  <p className="text-cyan-300 font-bold mb-2">Stadium Layout</p>
                  <p className="text-slate-300">Select service to see locations →</p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            {selectedService && (
              <motion.div
                className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <span className="text-5xl">{selectedService.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">{selectedService.name}</h2>
                      <p className="text-slate-300 mb-3">{selectedService.description}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">⭐</span>
                          <span className="text-white font-bold">{selectedService.rating}/5</span>
                        </div>
                        <div className="text-cyan-300 font-bold text-lg">{selectedService.cost}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Locations */}
                  <div>
                    <h3 className="font-bold text-cyan-300 mb-3">📍 Locations</h3>
                    <div className="space-y-2">
                      {selectedService.locations.map((loc, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-300">
                          <span className="text-cyan-400">▸</span>
                          <span>{loc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="font-bold text-emerald-300 mb-3">✨ Features</h3>
                    <div className="space-y-2">
                      {selectedService.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-300">
                          <span className="text-emerald-400">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Availability Banner */}
                <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-sm text-blue-300">
                    <span className="font-bold">Availability:</span> {selectedService.availability}
                  </p>
                </div>

                <button
                  onClick={() => setShowComingSoon(true)}
                  className="w-full mt-6 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all shadow-lg"
                >
                  📍 Book Now
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>

      {/* Coming Soon Modal */}
      <AnimatePresence>
        {showComingSoon && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowComingSoon(false)}
          >
            <motion.div
              className="rounded-2xl border-2 border-cyan-500/50 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm w-full max-w-md p-8 shadow-2xl"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-6">
                {/* Icon */}
                <div className="text-6xl animate-bounce">🚀</div>

                {/* Title */}
                <h2 className="text-3xl font-bold text-white">Coming Soon!</h2>

                {/* Description */}
                <div className="space-y-3">
                  <p className="text-slate-300">
                    The {selectedService?.name} booking system is currently under development.
                  </p>
                  <p className="text-slate-400 text-sm">
                    We're working hard to bring you a seamless booking experience. Check back soon!
                  </p>
                </div>

                {/* Features coming */}
                <div className="bg-slate-800/50 rounded-lg p-4 text-left border border-slate-700/50">
                  <p className="text-xs font-bold text-cyan-300 mb-3">🎯 Features Coming:</p>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li>✓ Real-time availability</li>
                    <li>✓ Instant booking confirmation</li>
                    <li>✓ Mobile notifications</li>
                    <li>✓ Payment integration</li>
                    <li>✓ Cancellation support</li>
                  </ul>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setShowComingSoon(false)}
                  className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all"
                >
                  Got It! 👍
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
