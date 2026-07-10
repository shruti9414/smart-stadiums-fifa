'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { redirect } from 'next/navigation'

interface AccessibilityFeature {
  id: string
  name: string
  icon: string
  description: string
  locations: string[]
  distance: string
  status: 'available' | 'in-use' | 'closed'
  features: string[]
}

export default function AccessibilityPage() {
  const { token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [selectedFeature, setSelectedFeature] = useState<AccessibilityFeature | null>(null)
  const [features, setFeatures] = useState<AccessibilityFeature[]>([])

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
    const accessibilityFeatures: AccessibilityFeature[] = [
      {
        id: '1',
        name: 'Wheelchair Accessible Seating',
        icon: '♿',
        description: 'Premium wheelchair-accessible seating with excellent stadium views',
        locations: ['Section A1', 'Section A4', 'Section C1', 'Section D2'],
        distance: '45m from main entrance',
        status: 'available',
        features: ['Ramp access', 'Companion seating', 'Clear sightline', 'Easy restroom access'],
      },
      {
        id: '2',
        name: 'Accessible Elevators',
        icon: '🛗',
        description: 'Wide elevators with accessible controls at comfortable height',
        locations: ['North Corner', 'South Corner', 'East Corner', 'West Corner'],
        distance: 'Max 50m from any location',
        status: 'available',
        features: ['Wide doors', 'Low buttons', 'Handrails', 'Emergency phone'],
      },
      {
        id: '3',
        name: 'Accessible Restrooms',
        icon: '🚻',
        description: 'Spacious restrooms with wheelchair turning radius',
        locations: ['Level 1 Main', 'Level 2 Main', 'VIP Area'],
        distance: 'Max 80m from seating',
        status: 'available',
        features: ['Grab bars', 'Accessible sinks', 'Emergency call button', 'Family room'],
      },
      {
        id: '4',
        name: 'Medical Facilities',
        icon: '🏥',
        description: 'Full medical support including wheelchair-accessible facilities',
        locations: ['Main Concourse', 'North Gate', 'South Gate'],
        distance: '100m maximum',
        status: 'available',
        features: ['Trained staff', 'Equipment available', 'Wheelchair accessible', '24/7 staffed'],
      },
      {
        id: '5',
        name: 'Service Animal Areas',
        icon: '🐕',
        description: 'Designated relief areas and water stations for service animals',
        locations: ['All Gate Areas', 'Rest Zones'],
        distance: 'At entry points',
        status: 'available',
        features: ['Relief areas', 'Water bowls', 'Shaded zones', 'Staff assistance'],
      },
      {
        id: '6',
        name: 'Audio Description',
        icon: '🎧',
        description: 'Live audio commentary describing game action and crowd reactions',
        locations: ['Any Seat'],
        distance: 'Wireless headsets',
        status: 'available',
        features: ['Real-time commentary', 'Multiple languages', 'Easy activation', 'Quality sound'],
      },
    ]
    setFeatures(accessibilityFeatures)
    setSelectedFeature(accessibilityFeatures[0])
  }, [])

  if (isChecking) return null

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold gradient-text">♿ Accessibility Guide</h1>
            <p className="text-slate-400 text-sm mt-1">Explore accessible facilities throughout the stadium</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Panel - Features List */}
          <motion.div
            className="lg:col-span-1 space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="space-y-3">
              {features.map((feature, idx) => (
                <motion.button
                  key={feature.id}
                  onClick={() => setSelectedFeature(feature)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    selectedFeature?.id === feature.id
                      ? 'backdrop-blur-2xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-400/50'
                      : 'backdrop-blur-xl bg-slate-800/30 border-slate-700/50 hover:border-slate-600/50'
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{feature.icon}</span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-sm">{feature.name}</p>
                      <p className="text-xs text-slate-400">{feature.distance}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right Panel - Stadium Map + Details */}
          <motion.div
            className="lg:col-span-3 space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {/* Stadium Map Visualization */}
            <div className="rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl backdrop-blur-sm">
              <div className="h-96 bg-gradient-to-b from-slate-950 to-black relative overflow-hidden">
                {/* Stadium SVG */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Stadium boundary */}
                  <ellipse cx="50" cy="50" rx="45" ry="40" fill="none" stroke="rgba(59, 130, 246, 0.3)" strokeWidth="0.8" />

                  {/* Field */}
                  <ellipse cx="50" cy="50" rx="35" ry="30" fill="rgba(34, 197, 94, 0.15)" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="0.5" />

                  {/* Accessible Seating Zones - Green */}
                  {selectedFeature?.id === '1' && (
                    <>
                      <rect x="15" y="15" width="20" height="20" fill="rgba(16, 185, 129, 0.4)" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="0.8" />
                      <rect x="65" y="15" width="20" height="20" fill="rgba(16, 185, 129, 0.4)" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="0.8" />
                      <rect x="15" y="65" width="20" height="20" fill="rgba(16, 185, 129, 0.4)" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="0.8" />
                      <rect x="65" y="65" width="20" height="20" fill="rgba(16, 185, 129, 0.4)" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="0.8" />
                      <text x="25" y="30" fill="#10b981" fontSize="4" fontWeight="bold" textAnchor="middle">A1</text>
                      <text x="75" y="30" fill="#10b981" fontSize="4" fontWeight="bold" textAnchor="middle">A4</text>
                      <text x="25" y="80" fill="#10b981" fontSize="4" fontWeight="bold" textAnchor="middle">C1</text>
                      <text x="75" y="80" fill="#10b981" fontSize="4" fontWeight="bold" textAnchor="middle">D2</text>
                    </>
                  )}

                  {/* Elevators - Blue (4 corners) */}
                  {selectedFeature?.id === '2' && (
                    <>
                      <rect x="8" y="8" width="8" height="8" fill="rgba(96, 165, 250, 0.6)" stroke="rgba(147, 197, 253, 0.8)" strokeWidth="0.5" />
                      <rect x="84" y="8" width="8" height="8" fill="rgba(96, 165, 250, 0.6)" stroke="rgba(147, 197, 253, 0.8)" strokeWidth="0.5" />
                      <rect x="8" y="84" width="8" height="8" fill="rgba(96, 165, 250, 0.6)" stroke="rgba(147, 197, 253, 0.8)" strokeWidth="0.5" />
                      <rect x="84" y="84" width="8" height="8" fill="rgba(96, 165, 250, 0.6)" stroke="rgba(147, 197, 253, 0.8)" strokeWidth="0.5" />
                      <text x="12" y="20" fill="#60a5fa" fontSize="3" fontWeight="bold" textAnchor="middle">N</text>
                      <text x="88" y="20" fill="#60a5fa" fontSize="3" fontWeight="bold" textAnchor="middle">N</text>
                      <text x="12" y="96" fill="#60a5fa" fontSize="3" fontWeight="bold" textAnchor="middle">S</text>
                      <text x="88" y="96" fill="#60a5fa" fontSize="3" fontWeight="bold" textAnchor="middle">S</text>
                    </>
                  )}

                  {/* Medical - Red Circle */}
                  {selectedFeature?.id === '4' && (
                    <>
                      <circle cx="50" cy="50" r="4" fill="rgba(239, 68, 68, 0.6)" stroke="rgba(252, 165, 165, 0.8)" strokeWidth="0.5" />
                      <circle cx="20" cy="20" r="3" fill="rgba(239, 68, 68, 0.6)" stroke="rgba(252, 165, 165, 0.8)" strokeWidth="0.5" />
                      <circle cx="80" cy="80" r="3" fill="rgba(239, 68, 68, 0.6)" stroke="rgba(252, 165, 165, 0.8)" strokeWidth="0.5" />
                      <text x="50" y="58" fill="#ef4444" fontSize="3" fontWeight="bold" textAnchor="middle">Main</text>
                      <text x="20" y="28" fill="#ef4444" fontSize="2.5" fontWeight="bold" textAnchor="middle">N</text>
                      <text x="80" y="88" fill="#ef4444" fontSize="2.5" fontWeight="bold" textAnchor="middle">S</text>
                    </>
                  )}

                  {/* Service Animal - Purple */}
                  {selectedFeature?.id === '5' && (
                    <>
                      <circle cx="15" cy="45" r="3" fill="rgba(168, 85, 247, 0.6)" stroke="rgba(216, 180, 254, 0.8)" strokeWidth="0.5" />
                      <circle cx="85" cy="45" r="3" fill="rgba(168, 85, 247, 0.6)" stroke="rgba(216, 180, 254, 0.8)" strokeWidth="0.5" />
                      <circle cx="50" cy="15" r="3" fill="rgba(168, 85, 247, 0.6)" stroke="rgba(216, 180, 254, 0.8)" strokeWidth="0.5" />
                      <circle cx="50" cy="85" r="3" fill="rgba(168, 85, 247, 0.6)" stroke="rgba(216, 180, 254, 0.8)" strokeWidth="0.5" />
                    </>
                  )}

                  {/* Audio Description - Represented as speaker icons */}
                  {selectedFeature?.id === '6' && (
                    <>
                      <text x="30" y="35" fill="#f97316" fontSize="5" fontWeight="bold" textAnchor="middle">🎧</text>
                      <text x="70" y="35" fill="#f97316" fontSize="5" fontWeight="bold" textAnchor="middle">🎧</text>
                      <text x="30" y="65" fill="#f97316" fontSize="5" fontWeight="bold" textAnchor="middle">🎧</text>
                      <text x="70" y="65" fill="#f97316" fontSize="5" fontWeight="bold" textAnchor="middle">🎧</text>
                    </>
                  )}
                </svg>

                {/* Legend Overlay */}
                <div className="absolute top-4 right-4 backdrop-blur-xl bg-black/80 border border-slate-700/50 rounded-lg p-3 text-xs">
                  <p className="text-cyan-300 font-bold mb-2">Stadium Zones</p>
                  <p className="text-slate-300">Green = Accessible Seating</p>
                  <p className="text-slate-300">Blue = Elevators</p>
                  <p className="text-slate-300">Red = Medical</p>
                </div>
              </div>
            </div>

            {/* Feature Details */}
            {selectedFeature && (
              <motion.div
                className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2">{selectedFeature.name}</h2>
                    <p className="text-slate-300">{selectedFeature.description}</p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                    selectedFeature.status === 'available'
                      ? 'bg-green-500/20 text-green-300'
                      : selectedFeature.status === 'in-use'
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {selectedFeature.status === 'available' && '✓ Available'}
                    {selectedFeature.status === 'in-use' && '⏳ In Use'}
                    {selectedFeature.status === 'closed' && '✕ Closed'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Locations */}
                  <div>
                    <h3 className="font-bold text-cyan-300 mb-3">📍 Locations</h3>
                    <div className="space-y-2">
                      {selectedFeature.locations.map((loc, idx) => (
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
                      {selectedFeature.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-slate-300">
                          <span className="text-emerald-400">✓</span>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </main>
    </div>
  )
}
