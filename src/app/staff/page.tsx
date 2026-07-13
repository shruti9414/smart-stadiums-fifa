'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useIncidentStore, type Incident } from '@/hooks/useIncidents'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertCircle, MapPin, Clock, Users, CheckCircle2, Phone, Navigation2,
  ChevronDown, Search, Filter, LogOut, Bell, Settings, Menu, X,
  Zap, Shield, Flame, User2, MoreVertical, TrendingUp, Activity,
  Radio, MapPinned, Car, Clock3, Briefcase
} from 'lucide-react'

interface TeamResource {
  id: string
  name: string
  type: 'medical' | 'security' | 'fire'
  status: 'available' | 'dispatched' | 'busy'
  location: string
  icon: React.ReactNode
  members: number
  eta: string
}

interface Dispatch {
  id: string
  incidentId: string
  teamType: string
  status: string
  eta?: string
  location?: string
  dispatchedAt: string
}

export default function StaffPage() {
  const { token, user } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [activeTab, setActiveTab] = useState<'incidents' | 'teams'>('incidents')
  const [resources, setResources] = useState<TeamResource[]>([])
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [currentTime, setCurrentTime] = useState('')
  const [dispatches, setDispatches] = useState<Dispatch[]>([])
  const [updatingStatus, setUpdatingStatus] = useState<'responding' | 'resolved' | null>(null)
  const [incidents, setIncidents] = useState<Incident[]>([])

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
    const loadIncidents = async () => {
      try {
        const authToken = localStorage.getItem('auth_token')
        if (!authToken) return

        const res = await fetch('/api/incidents/report', {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        if (res.ok) {
          const data = await res.json()
          const incidentsList = data.data?.incidents || []
          const loadedIncidents = incidentsList.map((inc: any) => ({
            id: inc.id,
            type: inc.type,
            severity: inc.severity,
            location: inc.location || 'Unknown',
            description: inc.description,
            status: inc.status,
            time: inc.createdAt,
          }))
          setIncidents(loadedIncidents)
          console.log('✓ Incidents loaded:', loadedIncidents.length)
        }
      } catch (err) {
        console.error('Failed to load incidents:', err)
      }
    }

    loadIncidents()
  }, [token])

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const authToken = localStorage.getItem('auth_token')
        if (!authToken) return

        const res = await fetch('/api/teams', {
          headers: { Authorization: `Bearer ${authToken}` },
        })

        if (!res.ok) throw new Error('Failed to fetch teams')

        const data = await res.json()

        // Map API response to TeamResource format
        const teamResources = (data.data || []).map((team: any): TeamResource => ({
          id: team.id,
          name: team.name,
          type: team.type as 'medical' | 'security' | 'fire',
          status: 'available' as const,
          location: team.location || '',
          icon: team.type === 'medical' ? <Zap className="w-5 h-5" /> : team.type === 'security' ? <Shield className="w-5 h-5" /> : <Flame className="w-5 h-5" />,
          members: team.members || 0,
          eta: team.eta || '',
        }))

        setResources(teamResources)
      } catch (err) {
        console.error('Error fetching teams:', err)
        // Fallback to empty if error
        setResources([])
      }
    }

    fetchTeams()
  }, [token])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const getSeverityConfig = (severity: string) => {
    switch (severity) {
      case 'critical':
        return { color: 'from-red-600 to-red-800', glow: 'shadow-red-500/50', border: 'border-red-500/50', text: 'text-red-300', bg: 'bg-red-500/10' }
      case 'high':
        return { color: 'from-orange-600 to-orange-800', glow: 'shadow-orange-500/50', border: 'border-orange-500/50', text: 'text-orange-300', bg: 'bg-orange-500/10' }
      case 'medium':
        return { color: 'from-amber-600 to-amber-800', glow: 'shadow-amber-500/50', border: 'border-amber-500/50', text: 'text-amber-300', bg: 'bg-amber-500/10' }
      default:
        return { color: 'from-green-600 to-green-800', glow: 'shadow-green-500/50', border: 'border-green-500/50', text: 'text-green-300', bg: 'bg-green-500/10' }
    }
  }

  const loadDispatches = async (incidentId: string) => {
    try {
      const authToken = localStorage.getItem('auth_token')
      const res = await fetch(`/api/dispatch?incidentId=${incidentId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      if (res.ok) {
        const data = await res.json()
        setDispatches(data.data || [])
      }
    } catch (err) {
      console.error('Failed to load dispatches:', err)
    }
  }

  const handleStatusUpdate = async (newStatus: 'responding' | 'resolved') => {
    if (!selectedIncident) return

    setUpdatingStatus(newStatus)

    try {
      const authToken = localStorage.getItem('auth_token')
      const res = await fetch(`/api/incidents/${selectedIncident.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!res.ok) {
        throw new Error('Failed to update incident')
      }

      const data = await res.json()

      // Update local state
      setSelectedIncident({ ...selectedIncident, status: newStatus })

      // Update incidents list
      setIncidents(incidents.map(inc => inc.id === selectedIncident.id ? { ...inc, status: newStatus } : inc))

      console.log('✓ Incident status updated:', newStatus)
    } catch (err) {
      console.error('Status update error:', err)
      alert('Failed to update incident status')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleDispatchResource = async (resourceId: string, incidentId?: string) => {
    if (!incidentId) {
      console.error('No incident selected for dispatch')
      return
    }

    setUpdatingId(resourceId)
    try {
      const authToken = localStorage.getItem('auth_token')
      const teamType = resourceId.split('_')[1] // Extract type from "team_medical"

      const res = await fetch('/api/dispatch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          incidentId,
          teamType,
          location: resources.find(r => r.id === resourceId)?.location,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to dispatch team')
      }

      const data = await res.json()

      // Update local state
      const updated = resources.map(r =>
        r.id === resourceId ? ({ ...r, status: 'dispatched' } as TeamResource) : r
      )
      setResources(updated)

      console.log('✓ Team dispatched:', data.data.id)
    } catch (err) {
      console.error('Dispatch error:', err)
      alert('Failed to dispatch team')
    } finally {
      setUpdatingId(null)
    }
  }

  const openCount = incidents.filter(i => i.status === 'open').length
  const respondingCount = incidents.filter(i => i.status === 'responding').length
  const resolvedCount = incidents.filter(i => i.status === 'resolved').length
  const availableTeams = resources.filter(r => r.status === 'available').length

  const stats = [
    { label: 'Active Incidents', value: openCount, icon: AlertCircle, color: 'from-red-600 to-red-800' },
    { label: 'Available Teams', value: availableTeams, icon: Users, color: 'from-cyan-600 to-cyan-800' },
    { label: 'Avg Response Time', value: '4.2 min', icon: Clock3, color: 'from-purple-600 to-purple-800' },
    { label: 'Resolved Today', value: resolvedCount, icon: CheckCircle2, color: 'from-green-600 to-green-800' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden" style={{ backgroundColor: '#050505' }}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-[0.03]"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-96 -left-96 w-[800px] h-[800px] bg-gradient-to-br from-red-500 to-orange-500 rounded-full blur-3xl opacity-[0.03]"
          animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_0%,rgba(0,229,255,0.02),transparent_50%)]" />
      </div>

      {/* Premium Header */}
      <motion.header
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{
          borderColor: 'rgba(0, 229, 255, 0.1)',
          background: 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,20,40,0.2), rgba(0,0,0,0.4))',
        }}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="px-8 py-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-start">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
              <h1 className="text-4xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                🚨 Emergency Response
              </h1>
              <p className="text-sm text-blue-200/60 mt-1">Real-time incident monitoring and team coordination</p>
            </motion.div>

            <motion.div className="flex items-center gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {/* Staff Profile Card - Premium Design */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-slate-800/60 to-slate-900/60 px-6 py-4 rounded-2xl border border-cyan-500/30 hover:border-cyan-400/60 transition-all hover:shadow-lg hover:shadow-cyan-500/20">
                <div className="flex items-center gap-4">
                  {/* Avatar Placeholder */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {user?.fullName?.charAt(0).toUpperCase() || 'S'}
                  </div>

                  {/* Staff Info */}
                  <div className="text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-slate-50 font-bold text-sm">{user?.fullName || 'Staff Member'}</p>
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                    <p className="text-xs text-slate-400 mb-2">{user?.email || 'staff@stadium.com'}</p>

                    {/* Department Badge */}
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30">
                        {user?.department === 'medical' && '🏥 Medical'}
                        {user?.department === 'security' && '🛡️ Security'}
                        {user?.department === 'fire' && '🚒 Fire/Rescue'}
                        {user?.department === 'general' && '👤 General'}
                        {!user?.department && '👤 General'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30">
                        🚨 Emergency Responder
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-2xl font-mono font-bold text-cyan-300">{currentTime}</div>
                <div className="text-xs text-green-400 flex items-center gap-1 justify-end mt-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  System Online
                </div>
              </div>

              <button className="p-2.5 hover:bg-white/5 rounded-lg transition-all duration-300">
                <Bell className="w-5 h-5 text-cyan-300" />
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('auth_token')
                  window.location.href = '/login'
                }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white text-sm font-bold transition-all duration-300 hover:shadow-lg hover:shadow-red-500/30 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto relative z-10">
        {/* Stats Cards */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,229,255,0.1)' }}
                className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border"
                style={{
                  borderColor: 'rgba(0, 229, 255, 0.2)',
                  background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.8), rgba(15, 23, 42, 0.6))',
                }}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${stat.color.includes('red') ? 'rgba(239, 68, 68, 0.1)' : stat.color.includes('cyan') ? 'rgba(0, 229, 255, 0.1)' : stat.color.includes('purple') ? 'rgba(147, 51, 234, 0.1)' : 'rgba(34, 197, 94, 0.1)'})`,
                  }}
                />

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-20`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-blue-200/60 mb-2">{stat.label}</p>
                  <motion.p
                    className="text-3xl font-black text-white"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + idx * 0.1, type: 'spring' }}
                  >
                    {stat.value}
                  </motion.p>
                </div>

                <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.div>
            )
          })}
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex gap-4 mb-8 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {['incidents', 'teams'].map((tab) => (
            <motion.button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className="relative px-6 py-3 font-bold text-sm transition-all duration-300"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className={activeTab === tab ? 'text-cyan-300' : 'text-blue-200/60'}>
                {tab === 'incidents' ? '📋 Incidents' : '🛡️ Teams'}
              </span>
              {activeTab === tab && (
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500"
                  layoutId="activeTab"
                  transition={{ duration: 0.3 }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Incidents Grid */}
        <AnimatePresence mode="wait">
          {activeTab === 'incidents' && (
            <motion.div
              key="incidents"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {incidents.map((incident) => {
                  const config = getSeverityConfig(incident.severity)
                  const isAnimating = incident.severity === 'critical'

                  return (
                    <motion.div
                      key={incident.id}
                      variants={itemVariants}
                      whileHover={{ y: -12, scale: 1.03 }}
                      onClick={() => {
                        setSelectedIncident(incident)
                        loadDispatches(incident.id)
                      }}
                      className="relative group text-left overflow-hidden rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300 cursor-pointer"
                      style={{
                        borderColor: config.border,
                        background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.8), rgba(15, 23, 42, 0.6))',
                      }}
                    >
                      {/* Critical pulsing border */}
                      {isAnimating && (
                        <motion.div
                          className="absolute inset-0 rounded-2xl pointer-events-none"
                          style={{
                            border: '2px solid',
                            borderColor: '#FF3B5C',
                          }}
                          animate={{ opacity: [0.3, 0.8, 0.3] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        />
                      )}

                      {/* Hover glow */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${config.bg})`,
                        }}
                      />

                      <div className="relative z-10 space-y-3">
                        <div className="flex items-start justify-between">
                          <motion.div
                            animate={isAnimating ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="text-3xl"
                          >
                            {incident.severity === 'critical' ? '🔴' : incident.severity === 'high' ? '🟠' : incident.severity === 'medium' ? '🟡' : '🟢'}
                          </motion.div>
                          <div className="p-1 hover:bg-white/10 rounded opacity-0 group-hover:opacity-100 transition-all cursor-pointer">
                            <MoreVertical className="w-4 h-4 text-blue-200/60" />
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white capitalize truncate">{incident.type.replace('_', ' ')}</p>
                          <p className="text-xs text-blue-200/60 flex items-center gap-1 mt-1">
                            <Clock className="w-3 h-3" />
                            {new Date(incident.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        <div className="flex gap-2 flex-wrap">
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${config.text} ${config.bg}`}>
                            {incident.severity}
                          </span>
                          <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${incident.status === 'open' ? 'text-red-300 bg-red-500/10' : incident.status === 'responding' ? 'text-yellow-300 bg-yellow-500/10' : 'text-green-300 bg-green-500/10'}`}>
                            {incident.status}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-white/5">
                          <p className="text-xs text-blue-200/60 flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {incident.location}
                          </p>
                        </div>
                      </div>

                      {/* Corner accent */}
                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          )}

          {/* Teams Grid */}
          {activeTab === 'teams' && (
            <motion.div
              key="teams"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {resources.map((resource) => {
                  const statusConfig = resource.status === 'available'
                    ? { color: 'from-green-600 to-green-800', glow: 'shadow-green-500/50', border: 'border-green-500/50' }
                    : resource.status === 'dispatched'
                    ? { color: 'from-cyan-600 to-cyan-800', glow: 'shadow-cyan-500/50', border: 'border-cyan-500/50' }
                    : { color: 'from-orange-600 to-orange-800', glow: 'shadow-orange-500/50', border: 'border-orange-500/50' }

                  return (
                    <motion.div
                      key={resource.id}
                      variants={itemVariants}
                      whileHover={{ y: -12, scale: 1.03 }}
                      className="relative group overflow-hidden rounded-2xl p-5 backdrop-blur-xl border transition-all duration-300"
                      style={{
                        borderColor: statusConfig.border,
                        background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.8), rgba(15, 23, 42, 0.6))',
                      }}
                    >
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${statusConfig.color}15)`,
                        }}
                      />

                      <div className="relative z-10 space-y-3">
                        <div className="flex items-start justify-between">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${statusConfig.color} bg-opacity-20`}>
                            {resource.icon}
                          </div>
                          <motion.div
                            className="w-3 h-3 rounded-full"
                            style={{
                              background: resource.status === 'available' ? '#22C55E' : resource.status === 'dispatched' ? '#00E5FF' : '#FF9500',
                            }}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          />
                        </div>

                        <div>
                          <p className="text-sm font-bold text-white">{resource.name}</p>
                          <p className="text-xs text-blue-200/60 flex items-center gap-1 mt-1">
                            <MapPinned className="w-3 h-3" />
                            {resource.location}
                          </p>
                        </div>

                        <div className="space-y-2 text-xs text-blue-200/60">
                          <div className="flex justify-between">
                            <span>Team Members:</span>
                            <span className="text-white font-bold">{resource.members}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>ETA:</span>
                            <span className="text-cyan-300 font-bold">{resource.eta}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Status:</span>
                            <span className={`font-bold capitalize ${resource.status === 'available' ? 'text-green-300' : resource.status === 'dispatched' ? 'text-cyan-300' : 'text-orange-300'}`}>
                              {resource.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </motion.div>
                  )
                })}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Premium Modal */}
      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedIncident(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              background: 'rgba(0, 0, 0, 0.5)',
            }}
          >
            <motion.div
              className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-2xl border p-8"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                borderColor: getSeverityConfig(selectedIncident.severity).border,
                background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.95), rgba(15, 23, 42, 0.8))',
              }}
            >
              <div className="absolute inset-0 opacity-20 pointer-events-none rounded-3xl"
                style={{
                  background: `linear-gradient(135deg, ${getSeverityConfig(selectedIncident.severity).bg})`,
                }}
              />

              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <motion.div
                    animate={selectedIncident.severity === 'critical' ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="text-5xl"
                  >
                    {selectedIncident.severity === 'critical' ? '🔴' : selectedIncident.severity === 'high' ? '🟠' : selectedIncident.severity === 'medium' ? '🟡' : '🟢'}
                  </motion.div>
                  <motion.button
                    onClick={() => setSelectedIncident(null)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-2 hover:bg-white/10 rounded-lg transition-all"
                  >
                    <X className="w-5 h-5 text-blue-200/60" />
                  </motion.button>
                </div>

                <div>
                  <h2 className="text-2xl font-black text-white capitalize mb-2">{selectedIncident.type.replace('_', ' ')}</h2>
                  <p className="text-sm text-blue-200/60">Reported {new Date(selectedIncident.time).toLocaleString()}</p>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${getSeverityConfig(selectedIncident.severity).text} ${getSeverityConfig(selectedIncident.severity).bg}`}>
                    {selectedIncident.severity}
                  </span>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold ${selectedIncident.status === 'open' ? 'text-red-300 bg-red-500/10' : selectedIncident.status === 'responding' ? 'text-yellow-300 bg-yellow-500/10' : 'text-green-300 bg-green-500/10'}`}>
                    {selectedIncident.status}
                  </span>
                </div>

                <div className="space-y-3 backdrop-blur-sm">
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-blue-200/60 mb-1">📍 Location</p>
                    <p className="text-white font-semibold">{selectedIncident.location}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                    <p className="text-xs text-blue-200/60 mb-1">📋 Description</p>
                    <p className="text-white text-sm">{selectedIncident.description}</p>
                  </div>
                </div>

                {/* Dispatched Teams Status */}
                {dispatches.length > 0 && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h3 className="text-sm font-bold text-green-400 flex items-center gap-2">
                      ✓ Teams Dispatched
                    </h3>
                    <div className="space-y-2">
                      {dispatches.map((dispatch) => (
                        <motion.div
                          key={dispatch.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 flex justify-between items-center"
                        >
                          <div>
                            <p className="text-sm font-bold text-green-300 capitalize">
                              {dispatch.teamType === 'medical' && '🏥'}
                              {dispatch.teamType === 'security' && '🛡️'}
                              {dispatch.teamType === 'fire' && '🚒'}
                              {' '}{dispatch.teamType} Team
                            </p>
                            <p className="text-xs text-green-200/60">Dispatched just now</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-green-300">{dispatch.eta || '2 min'}</p>
                            <p className="text-xs text-green-200/60 capitalize">{dispatch.status}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Available Teams Section - Display Only */}
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                    👥 Available Teams
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {resources.map((team) => (
                      <motion.div
                        key={team.id}
                        className={`py-2 px-3 rounded-lg text-xs font-bold text-center ${
                          team.status === 'available'
                            ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                            : 'bg-gray-500/20 border border-gray-500/50 text-gray-400'
                        }`}
                      >
                        {team.type === 'medical' && '🏥'}
                        {team.type === 'security' && '🛡️'}
                        {team.type === 'fire' && '🚒'}
                        {' '}{team.name.split(' ')[0]}
                        <p className="text-xs mt-1">{team.status}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                  <motion.button
                    onClick={() => handleStatusUpdate('responding')}
                    disabled={updatingStatus === 'responding'}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="py-2.5 px-4 rounded-lg bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/30"
                  >
                    {updatingStatus === 'responding' ? '⏳ Updating...' : '⏳ Responding'}
                  </motion.button>
                  {selectedIncident?.status !== 'resolved' && (
                    <motion.button
                      onClick={() => handleStatusUpdate('resolved')}
                      disabled={updatingStatus === 'resolved'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="py-2.5 px-4 rounded-lg bg-gradient-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-green-500/30"
                    >
                      {updatingStatus === 'resolved' ? '⏳ Updating...' : '✓ Resolved'}
                    </motion.button>
                  )}
                  {selectedIncident?.status === 'resolved' && (
                    <div className="py-2.5 px-4 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-bold text-sm text-center">
                      ✅ Already Resolved
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
