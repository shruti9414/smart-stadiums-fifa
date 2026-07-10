'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface Hotspot {
  id: string
  name: string
  x: number
  y: number
  incidentCount: number
  severity: 'low' | 'medium' | 'high'
  lastIncident: string
  category: string
}

interface IncidentHotspotsProps {
  interactive?: boolean
}

export function IncidentHotspots({ interactive = true }: IncidentHotspotsProps) {
  const [mounted, setMounted] = useState(false)
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null)

  const hotspots: Hotspot[] = [
    { id: '1', name: 'North Gate Area', x: 20, y: 25, incidentCount: 12, severity: 'high', lastIncident: '5 min ago', category: 'Congestion' },
    { id: '2', name: 'East Entrance', x: 75, y: 30, incidentCount: 8, severity: 'medium', lastIncident: '15 min ago', category: 'Queue Buildup' },
    { id: '3', name: 'South Restroom', x: 50, y: 85, incidentCount: 6, severity: 'low', lastIncident: '30 min ago', category: 'Minor Issues' },
    { id: '4', name: 'West Stand Section', x: 15, y: 65, incidentCount: 4, severity: 'low', lastIncident: '2 hours ago', category: 'Seating' },
    { id: '5', name: 'Food Court Hub', x: 60, y: 55, incidentCount: 10, severity: 'high', lastIncident: '3 min ago', category: 'Overcrowding' },
    { id: '6', name: 'VIP Area', x: 45, y: 15, incidentCount: 2, severity: 'low', lastIncident: '1 hour ago', category: 'Access' },
  ]

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      className="relative w-full bg-gradient-to-br from-slate-900/60 to-slate-950/60 rounded-2xl border border-slate-700/50 p-6 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white mb-2">🔴 Incident Hotspots</h3>
          <p className="text-sm text-slate-400">Real-time incident concentration areas</p>
        </div>

        {/* Stadium Map Visualization */}
        <div className="relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 rounded-xl border border-slate-700/30 p-4 aspect-video">
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="grid grid-cols-10 grid-rows-10 gap-0 w-full h-full">
              {Array.from({ length: 100 }).map((_, i) => (
                <div key={i} className="border border-slate-600/20" />
              ))}
            </div>
          </div>

          {/* Stadium outline */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Stadium boundary */}
            <ellipse cx="50" cy="50" rx="45" ry="40" fill="none" stroke="rgba(59, 130, 246, 0.2)" strokeWidth="1" />
            {/* Field area */}
            <ellipse cx="50" cy="50" rx="35" ry="30" fill="rgba(34, 197, 94, 0.05)" stroke="rgba(34, 197, 94, 0.2)" strokeWidth="1" />
          </svg>

          {/* Hotspots */}
          {hotspots.map((hotspot) => (
            <motion.div
              key={hotspot.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
              style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
              onClick={() => interactive && setSelectedHotspot(hotspot)}
              whileHover={{ scale: 1.2 }}
            >
              {/* Animated pulse rings */}
              <motion.div
                className={`absolute w-12 h-12 rounded-full -inset-6 ${
                  hotspot.severity === 'high'
                    ? 'bg-red-500/20'
                    : hotspot.severity === 'medium'
                    ? 'bg-yellow-500/20'
                    : 'bg-green-500/20'
                }`}
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* Main marker */}
              <div
                className={`relative w-8 h-8 rounded-full flex items-center justify-center font-bold text-white border-2 border-white shadow-lg ${
                  hotspot.severity === 'high'
                    ? 'bg-red-600'
                    : hotspot.severity === 'medium'
                    ? 'bg-yellow-600'
                    : 'bg-green-600'
                }`}
              >
                {hotspot.incidentCount}
              </div>

              {/* Hover tooltip */}
              <motion.div
                className="absolute left-0 -bottom-32 w-48 bg-slate-900/95 border border-slate-700/50 rounded-lg p-3 text-sm opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none"
                initial={{ scale: 0.8, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
              >
                <p className="font-bold text-white">{hotspot.name}</p>
                <p className="text-slate-400">{hotspot.category}</p>
                <p className="text-xs text-slate-500 mt-1">Last: {hotspot.lastIncident}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-600" />
            <span className="text-slate-300">High (7+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-600" />
            <span className="text-slate-300">Medium (3-6)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600" />
            <span className="text-slate-300">Low (1-2)</span>
          </div>
        </div>

        {/* Hotspot Details */}
        {selectedHotspot && interactive && (
          <motion.div
            className="rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 p-4 mt-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h4 className="font-bold text-white">{selectedHotspot.name}</h4>
                <p className="text-sm text-slate-400">{selectedHotspot.category}</p>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                  selectedHotspot.severity === 'high'
                    ? 'bg-red-500/20 text-red-300'
                    : selectedHotspot.severity === 'medium'
                    ? 'bg-yellow-500/20 text-yellow-300'
                    : 'bg-green-500/20 text-green-300'
                }`}
              >
                {selectedHotspot.severity === 'high' && '🔴 High'}
                {selectedHotspot.severity === 'medium' && '🟡 Medium'}
                {selectedHotspot.severity === 'low' && '🟢 Low'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-slate-400">Incidents</p>
                <p className="text-lg font-bold text-white">{selectedHotspot.incidentCount}</p>
              </div>
              <div>
                <p className="text-slate-400">Last Incident</p>
                <p className="text-sm text-white">{selectedHotspot.lastIncident}</p>
              </div>
              <div>
                <p className="text-slate-400">Risk Level</p>
                <p className={`text-sm font-bold ${
                  selectedHotspot.severity === 'high'
                    ? 'text-red-400'
                    : selectedHotspot.severity === 'medium'
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}>
                  {selectedHotspot.severity === 'high' ? '88%' : selectedHotspot.severity === 'medium' ? '45%' : '12%'}
                </p>
              </div>
            </div>

            <button className="w-full mt-4 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all text-sm">
              View Incident History
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
