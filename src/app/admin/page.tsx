'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useIncidentStore } from '@/hooks/useIncidents'
import { redirect } from 'next/navigation'
import Link from 'next/link'

interface ZoneData {
  name: string
  occupancy: number
  capacity: number
  incidents: number
  status: 'safe' | 'warning' | 'critical'
  icon: string
}

export default function AdminPage() {
  const { token, user } = useAuth()
  const { incidents, initializeMockData } = useIncidentStore()
  const [zoneData, setZoneData] = useState<ZoneData[]>([])
  const [isChecking, setIsChecking] = useState(true)
  const [hoveredZone, setHoveredZone] = useState<string | null>(null)

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const savedToken = localStorage.getItem('auth_token')
      if (!savedToken && !token) {
        redirect('/login')
      }
      if (user?.role !== 'admin') {
        redirect('/login')
      }
      setIsChecking(false)
    }, 50)
    return () => clearTimeout(checkAuth)
  }, [token, user])

  useEffect(() => {
    // Initialize mock data if empty
    if (incidents.length === 0) {
      initializeMockData()
    }
  }, [incidents, initializeMockData])

  useEffect(() => {
    const zones: ZoneData[] = [
      { name: 'North Stand', occupancy: 72, capacity: 100, incidents: incidents.filter(i => i.location.includes('A')).length, status: 'safe', icon: '🔵' },
      { name: 'South Stand', occupancy: 85, capacity: 100, incidents: incidents.filter(i => i.location.includes('B')).length, status: 'warning', icon: '🟡' },
      { name: 'East Stand', occupancy: 92, capacity: 100, incidents: incidents.filter(i => i.severity === 'critical').length, status: 'critical', icon: '🔴' },
      { name: 'West Stand', occupancy: 68, capacity: 100, incidents: incidents.filter(i => i.status === 'open').length, status: 'safe', icon: '🟢' },
      { name: 'VIP Boxes', occupancy: 95, capacity: 50, incidents: incidents.filter(i => i.type === 'medical').length, status: 'critical', icon: '👑' },
      { name: 'General Seating', occupancy: 78, capacity: 150, incidents: incidents.filter(i => i.status === 'responding').length, status: 'warning', icon: '🎪' },
    ]
    setZoneData(zones)
  }, [incidents])

  const getGradient = (status: string) => {
    switch (status) {
      case 'safe':
        return 'from-emerald-600 via-green-600 to-emerald-700'
      case 'warning':
        return 'from-amber-600 via-yellow-600 to-amber-700'
      case 'critical':
        return 'from-rose-600 via-red-600 to-rose-700'
      default:
        return 'from-slate-600 via-slate-600 to-slate-700'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'safe':
        return 'bg-emerald-500/40 text-emerald-200 border-emerald-500/60'
      case 'warning':
        return 'bg-amber-500/40 text-amber-200 border-amber-500/60'
      case 'critical':
        return 'bg-rose-500/40 text-rose-200 border-rose-500/60'
      default:
        return 'bg-slate-500/40 text-slate-200 border-slate-500/60'
    }
  }

  const getOccupancyBarColor = (occupancy: number) => {
    if (occupancy > 85) return 'from-rose-500 to-red-600'
    if (occupancy > 70) return 'from-amber-500 to-yellow-600'
    return 'from-emerald-500 to-green-600'
  }

  const totalOccupancy = Math.round(
    zoneData.reduce((sum, zone) => sum + zone.occupancy, 0) / zoneData.length
  )
  const totalIncidents = incidents.length
  const criticalZones = incidents.filter(i => i.severity === 'critical').length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-900 overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      <header className="relative z-40 border-b border-slate-800/40 bg-gradient-to-r from-black/50 via-blue-900/20 to-black/50 backdrop-blur-2xl px-8 py-8 sticky top-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
              🛡️ Operations Center
            </h1>
            <p className="text-sm text-slate-300 mt-2">Real-time stadium management & monitoring</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/admin/manage-staff"
              className="px-4 py-2 bg-cyan-500/20 text-cyan-300 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium border border-cyan-500/20 hover:border-cyan-500/40"
            >
              👮 Manage Staff
            </Link>
            <Link
              href="/admin/manage-teams"
              className="px-4 py-2 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-all text-sm font-medium border border-blue-500/20 hover:border-blue-500/40"
            >
              🛡️ Manage Teams
            </Link>
            <button
              onClick={() => {
                localStorage.removeItem('auth_token')
                window.location.href = '/login'
              }}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm font-medium border border-red-500/20 hover:border-red-500/40"
            >
              🚪 Logout
            </button>
            <div className="text-right backdrop-blur-md bg-white/5 px-6 py-4 rounded-2xl border border-slate-700/40">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <p className="text-slate-50 font-bold">{user?.fullName}</p>
              </div>
              <p className="text-xs text-slate-400 uppercase tracking-widest">Administrator Access</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-30 px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Top Stats */}
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { label: 'Avg Occupancy', value: `${totalOccupancy}%`, icon: '📊', color: 'from-blue-600 to-cyan-600' },
            { label: 'Total Incidents', value: totalIncidents, icon: '🚨', color: 'from-rose-600 to-red-600' },
            { label: 'Critical Zones', value: criticalZones, icon: '⚠️', color: 'from-amber-600 to-orange-600' },
            { label: 'System Status', value: 'ONLINE', icon: '✓', color: 'from-emerald-600 to-green-600' },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="group relative overflow-hidden rounded-2xl backdrop-blur-xl border border-slate-700/40 p-6 hover:border-slate-600/60 transition-all duration-300 hover:shadow-2xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl group-hover:blur-3xl transition-all duration-300"></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className={`text-3xl`}>{stat.icon}</div>
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                    <span className="text-white font-bold text-sm">↑</span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm font-medium mb-2">{stat.label}</p>
                <p className="text-3xl font-black bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Zones Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Zone Occupancy Heatmap</h2>
            <div className="flex gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">Safe</span>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40">Warning</span>
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">Critical</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {zoneData.map((zone, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setHoveredZone(zone.name)}
                onMouseLeave={() => setHoveredZone(null)}
                className="group relative overflow-hidden rounded-2xl backdrop-blur-xl border border-slate-700/40 hover:border-slate-600/60 transition-all duration-300 hover:shadow-2xl"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(zone.status)} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>

                <div className="relative z-10 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{zone.icon}</span>
                      <div>
                        <h3 className="font-bold text-white">{zone.name}</h3>
                        <p className="text-xs text-slate-400">{zone.capacity} capacity</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${getStatusBadge(zone.status)}`}>
                      {zone.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-baseline">
                      <p className="text-slate-300 text-sm font-medium">Occupancy</p>
                      <p className="text-2xl font-black text-white">
                        {zone.occupancy}%
                      </p>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full h-2 rounded-full bg-slate-800/60 overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${getOccupancyBarColor(zone.occupancy)} transition-all duration-500`}
                          style={{ width: `${zone.occupancy}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>0%</span>
                        <span>100%</span>
                      </div>
                    </div>

                    {zone.incidents > 0 && (
                      <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                        <p className="text-red-300 text-sm font-bold">
                          🚨 {zone.incidents} Incident{zone.incidents > 1 ? 's' : ''}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-white">Recent Incidents ({incidents.length})</h2>
          {incidents.length === 0 ? (
            <div className="rounded-2xl border border-slate-700/40 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8 text-center">
              <p className="text-slate-400">No incidents reported</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-3">
              {incidents.map(incident => (
                <div key={incident.id} className="rounded-lg border border-slate-700/40 bg-slate-900/40 p-4 hover:bg-slate-900/60 transition-all">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{incident.severity === 'critical' ? '🔴' : incident.severity === 'high' ? '🟠' : incident.severity === 'medium' ? '🟡' : '🟢'}</span>
                        <p className="font-bold text-white capitalize">{incident.type.replace('_', ' ')}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          incident.status === 'open' ? 'bg-red-500/30 text-red-300' :
                          incident.status === 'responding' ? 'bg-yellow-500/30 text-yellow-300' :
                          'bg-green-500/30 text-green-300'
                        }`}>
                          {incident.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-300">{incident.description}</p>
                      <p className="text-xs text-slate-400 mt-2">📍 {incident.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Predictions */}
        <div className="relative overflow-hidden rounded-2xl backdrop-blur-xl border border-slate-700/40 p-8 hover:border-slate-600/60 transition-all">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-600 opacity-5"></div>

          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-white mb-6">🤖 AI Predictions & Forecasts</h2>

            <div className="grid md:grid-cols-4 gap-4">
              {[
                { time: '+30 mins', occupancy: '78%', confidence: '92%', risk: 'Low' },
                { time: '+1 hour', occupancy: '82%', confidence: '88%', risk: 'Medium' },
                { time: '+1.5 hours', occupancy: '80%', confidence: '85%', risk: 'Low' },
                { time: '+2 hours', occupancy: '76%', confidence: '82%', risk: 'Low' },
              ].map((pred, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-gradient-to-br from-slate-800/60 to-slate-900/60 border border-slate-700/40 hover:border-cyan-500/40 transition-all">
                  <p className="text-sm text-slate-400 mb-2">{pred.time}</p>
                  <p className="text-2xl font-bold text-cyan-300 mb-3">{pred.occupancy}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Confidence:</span>
                      <span className="text-blue-300 font-bold">{pred.confidence}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Risk:</span>
                      <span className={`font-bold ${pred.risk === 'Low' ? 'text-green-300' : 'text-amber-300'}`}>{pred.risk}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
