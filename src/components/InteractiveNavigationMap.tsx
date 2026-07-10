'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface NavigationMapProps {
  userLocation?: { lat: number; lng: number }
  destination?: string
}

export function InteractiveNavigationMap({ userLocation = { lat: 28.6139, lng: 77.2090 }, destination }: NavigationMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const [mounted, setMounted] = useState(false)
  const [selectedPOI, setSelectedPOI] = useState<string | null>(null)
  const [routeDistance, setRouteDistance] = useState<string>('0.5 km')
  const [routeTime, setRouteTime] = useState<string>('2 min')

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted || !mapContainer.current) return

    try {
      // Create map with zoom control on right side
      map.current = L.map(mapContainer.current, {
        zoomControl: false, // Disable default zoom control
      }).setView([userLocation.lat, userLocation.lng], 18)

      // Add zoom control on right side
      L.control.zoom({ position: 'bottomright' }).addTo(map.current)

      // OpenStreetMap tiles (FREE - no API key needed!)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map.current)

      // Custom icon for user location
      const userIcon = L.divIcon({
        html: `
          <div class="w-8 h-8 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <span class="text-xs">📍</span>
          </div>
        `,
        iconSize: [32, 32],
        className: '',
      })

      // Add user location marker
      L.marker([userLocation.lat, userLocation.lng], {
        icon: userIcon,
      })
        .addTo(map.current)
        .bindPopup('Your Location')

      // POI markers
      const pois = [
        { name: 'Gate A', lat: 28.6145, lng: 77.2095, icon: '🚪' },
        { name: 'Medical Center', lat: 28.6135, lng: 77.2105, icon: '🏥' },
        { name: 'Restroom', lat: 28.6155, lng: 77.2115, icon: '🚻' },
        { name: 'Food Court', lat: 28.6125, lng: 77.2085, icon: '🍽️' },
        { name: 'Parking Lot', lat: 28.6165, lng: 77.2095, icon: '🅿️' },
      ]

      pois.forEach((poi) => {
        const poiIcon = L.divIcon({
          html: `
            <div class="w-10 h-10 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center text-lg font-bold border-2 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform">
              ${poi.icon}
            </div>
          `,
          iconSize: [40, 40],
          className: '',
        })

        L.marker([poi.lat, poi.lng], { icon: poiIcon })
          .addTo(map.current!)
          .bindPopup(`
            <div class="text-center">
              <p class="font-bold">${poi.name}</p>
              <p class="text-xs text-gray-600">250m away • 3 min walk</p>
            </div>
          `)
          .on('click', () => setSelectedPOI(poi.name))
      })

      // Draw route line
      const routeCoordinates: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [28.6145, 77.2095],
      ]

      L.polyline(routeCoordinates, {
        color: '#06b6d4',
        weight: 4,
        opacity: 0.8,
        dashArray: '5, 5',
      }).addTo(map.current)

      // Add heatmap circles for crowd density
      const heatPoints = [
        { lat: 28.6140, lng: 77.2100, intensity: 80 },
        { lat: 28.6150, lng: 77.2110, intensity: 60 },
        { lat: 28.6130, lng: 77.2090, intensity: 40 },
      ]

      heatPoints.forEach((point) => {
        const color = point.intensity > 70 ? '#ef4444' : point.intensity > 40 ? '#eab308' : '#22c55e'
        L.circleMarker([point.lat, point.lng], {
          radius: 15,
          fillColor: color,
          color: color,
          weight: 2,
          opacity: 0.7,
          fillOpacity: 0.4,
        })
          .addTo(map.current!)
          .bindPopup(`Crowd Density: ${point.intensity}%`)
      })
    } catch (error) {
      console.error('Map initialization error:', error)
    }

    return () => {
      if (map.current) {
        map.current.remove()
      }
    }
  }, [mounted, userLocation])

  if (!mounted) return null

  return (
    <motion.div
      className="relative w-full h-full bg-black overflow-hidden rounded-3xl"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Top Info Bar */}
      <motion.div
        className="absolute top-6 left-6 backdrop-blur-xl bg-black/80 border-2 border-cyan-500/50 rounded-2xl px-8 py-5 z-[1000] shadow-2xl max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center gap-8">
          <div>
            <p className="text-xs text-cyan-400 font-bold mb-1">📍 DESTINATION</p>
            <p className="text-lg font-bold text-white">{destination || 'Seating Area'}</p>
          </div>
          <div className="border-l-2 border-cyan-500/50 pl-8">
            <p className="text-xs text-emerald-400 font-bold mb-1">📏 DISTANCE</p>
            <p className="text-lg font-bold text-emerald-300">{routeDistance}</p>
          </div>
          <div className="border-l-2 border-cyan-500/50 pl-8">
            <p className="text-xs text-blue-400 font-bold mb-1">⏱️ ETA</p>
            <p className="text-lg font-bold text-blue-300">{routeTime}</p>
          </div>
        </div>
      </motion.div>

      {/* Legend Panel */}
      <motion.div
        className="absolute bottom-6 left-6 backdrop-blur-xl bg-black/80 border-2 border-blue-500/50 rounded-2xl p-6 z-[1000] w-72 shadow-2xl"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-sm font-bold text-cyan-300 mb-4 flex items-center gap-2">
          <span>🗺️</span>
          <span>Map Legend</span>
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 pb-2 border-b border-slate-700/50">
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 shadow-lg" />
            <span className="text-sm text-slate-200 font-medium">Your Location</span>
          </div>
          <div className="flex items-center gap-3 pb-2 border-b border-slate-700/50">
            <div className="w-4 h-4 rounded-full bg-red-500 shadow-lg" />
            <span className="text-sm text-slate-200 font-medium">High Crowd (80%+)</span>
          </div>
          <div className="flex items-center gap-3 pb-2 border-b border-slate-700/50">
            <div className="w-4 h-4 rounded-full bg-yellow-500 shadow-lg" />
            <span className="text-sm text-slate-200 font-medium">Medium Crowd (40-80%)</span>
          </div>
          <div className="flex items-center gap-3 pb-2 border-b border-slate-700/50">
            <div className="w-4 h-4 rounded-full bg-green-500 shadow-lg" />
            <span className="text-sm text-slate-200 font-medium">Low Crowd (&lt;40%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-1 bg-cyan-400" />
            <span className="text-sm text-slate-200 font-medium">Route Path</span>
          </div>
        </div>
      </motion.div>

      {/* POI Details Popup */}
      <AnimatePresence>
        {selectedPOI && (
          <motion.div
            className="absolute bottom-6 right-6 backdrop-blur-xl bg-black/80 border-2 border-emerald-500/50 rounded-2xl p-6 z-[1000] w-80 shadow-2xl"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ delay: 0.1 }}
          >
            <button
              onClick={() => setSelectedPOI(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{selectedPOI}</h3>
                <p className="text-xs text-emerald-400 font-semibold">📍 Point of Interest</p>
              </div>

              <div className="space-y-2 text-sm bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">📏 Distance</span>
                  <span className="text-emerald-300 font-bold text-lg">250 m</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">⏱️ Walk Time</span>
                  <span className="text-emerald-300 font-bold text-lg">3 min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">👥 Occupancy</span>
                  <span className="text-cyan-300 font-bold text-lg">68%</span>
                </div>
              </div>

              <button className="w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold rounded-lg transition-all shadow-lg">
                🚀 Start Navigation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
