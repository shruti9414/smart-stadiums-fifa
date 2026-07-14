'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const useAuth = () => {
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('auth_token'))
      const savedUser = localStorage.getItem('auth_user')
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error('Failed to parse user:', e)
        }
      }
    }
  }, [])
  return { user, token }
}

import { StadiumDigitalTwin } from '@/components/StadiumDigitalTwin'

interface CrowdStats {
  totalOccupancy: number
  zones: unknown[]
  predictions: Array<{ time: string; occupancy: number; confidence: number }>
  lastUpdated: string
}

export default function Dashboard() {
  const { user, token } = useAuth()
  const [occupancy, setOccupancy] = useState(65.5)
  const [crowdStats, setCrowdStats] = useState<CrowdStats | null>(null)
  const [isChecking, setIsChecking] = useState(true)

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
    const loadCrowd = async () => {
      try {
        const res = await fetch('/api/crowd/live-stats?stadiumId=default-stadium', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setCrowdStats(data.data)
          setOccupancy(data.data.totalOccupancy)
        }
      } catch (err) {
        console.error('Error loading crowd stats:', err)
      }
    }

    if (token) {
      loadCrowd()
      const interval = setInterval(loadCrowd, 30000)
      return () => clearInterval(interval)
    }
  }, [token])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text">Dashboard</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time stadium operations</p>
          </div>
          <div className="text-right">
            <p className="text-slate-200 font-semibold text-lg">{user?.fullName}</p>
            <p className="text-sm text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 space-y-8 max-w-7xl mx-auto">
        {/* Stadium Digital Twin - Hero Section */}
        <motion.div
          className="rounded-3xl border border-blue-500/30 overflow-hidden shadow-2xl backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="h-[600px] bg-black/90">
            <StadiumDigitalTwin occupancy={occupancy} />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-4">
          <StatCard label="Stadium Occupancy" value={`${Math.round(occupancy)}%`} icon="📊" trend="↑ 2.5%" />
          <StatCard label="Live Visitors" value="8,234" icon="👥" trend="↑ 1,234" />
          <StatCard label="Active Incidents" value="3" icon="🚨" trend="↓ 1" />
          <StatCard label="Volunteers" value="127" icon="🤝" trend="↑ 12" />
        </div>

        {/* Quick Navigation */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <NavCard icon="🗺️" label="Navigation" href="/dashboard/navigate" />
          <NavCard icon="📊" label="Analytics" href="/dashboard/analytics" />
          <NavCard icon="👥" label="Volunteers" href="/admin/volunteer-management" />
          <NavCard icon="📈" label="Staff Perf." href="/admin/staff-performance" />
          <NavCard icon="🚨" label="Emergency" href="/admin/emergency-response" />
          <NavCard icon="👥" label="Teams" href="/admin/manage-teams" />
          <NavCard icon="👨‍💼" label="Staff" href="/admin/manage-staff" />
          <NavCard icon="🌐" label="Public Site" href="/visitor" />
        </motion.div>

        {/* Live Feed & Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Live Feed */}
          <div className="md:col-span-2 rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              <h2 className="text-xl font-bold text-white">Live Activity</h2>
            </div>
            <div className="space-y-3">
              <ActivityItem icon="🚪" title="Gate A opened" time="2 mins ago" type="info" />
              <ActivityItem icon="👥" title="Zone C crowd surge detected" time="5 mins ago" type="warning" />
              <ActivityItem icon="🏥" title="Medical assistance dispatched" time="12 mins ago" type="incident" />
              <ActivityItem icon="🎫" title="Ticket validation completed" time="18 mins ago" type="info" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 backdrop-blur-sm p-6 hover:border-yellow-500/30 transition-all">
              <p className="text-sm text-slate-400 mb-2">Stadium Status</p>
              <p className="text-2xl font-bold text-yellow-300">Operational</p>
              <p className="text-xs text-slate-500 mt-2">All systems nominal</p>
            </div>
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-blue-500/10 to-blue-600/5 backdrop-blur-sm p-6 hover:border-blue-500/30 transition-all">
              <p className="text-sm text-slate-400 mb-2">Temperature</p>
              <p className="text-2xl font-bold text-blue-300">22°C</p>
              <p className="text-xs text-slate-500 mt-2">Optimal conditions</p>
            </div>
            <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm p-6 hover:border-green-500/30 transition-all">
              <p className="text-sm text-slate-400 mb-2">Security</p>
              <p className="text-2xl font-bold text-green-300">Secure</p>
              <p className="text-xs text-slate-500 mt-2">0 incidents</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string
  value: string
  icon: string
  trend: string
}) {
  return (
    <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-5 hover:border-slate-600/50 hover:bg-slate-900/80 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <span className="text-2xl">{icon}</span>
        <span className="text-xs font-semibold text-green-400">{trend}</span>
      </div>
      <p className="text-sm text-slate-400 mb-2 group-hover:text-slate-300 transition-colors">{label}</p>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  )
}

function ActivityItem({
  icon,
  title,
  time,
  type,
}: {
  icon: string
  title: string
  time: string
  type: 'info' | 'warning' | 'incident'
}) {
  const typeColors = {
    info: 'border-blue-500/30 bg-blue-500/10',
    warning: 'border-yellow-500/30 bg-yellow-500/10',
    incident: 'border-red-500/30 bg-red-500/10',
  }

  const textColors = {
    info: 'text-blue-300',
    warning: 'text-yellow-300',
    incident: 'text-red-300',
  }

  return (
    <div className={`rounded-lg border ${typeColors[type]} p-4 flex items-center gap-4 hover:bg-opacity-20 transition-all`}>
      <span className="text-xl">{icon}</span>
      <div className="flex-1">
        <p className={`text-sm font-medium ${textColors[type]}`}>{title}</p>
        <p className="text-xs text-slate-500 mt-1">{time}</p>
      </div>
      <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
    </div>
  )
}

function NavCard({ icon, label, href }: { icon: string; label: string; href: string }) {
  return (
    <Link href={href}>
      <motion.div
        className="rounded-lg border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-4 hover:border-slate-600/50 hover:bg-slate-900/80 transition-all duration-300 group cursor-pointer text-center"
        whileHover={{ scale: 1.05, y: -2 }}
      >
        <span className="text-2xl mb-2 block group-hover:scale-110 transition-transform">{icon}</span>
        <p className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors">{label}</p>
      </motion.div>
    </Link>
  )
}
