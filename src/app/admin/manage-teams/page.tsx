'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronLeft, Users, Zap, Shield, Flame, User2, Mail, Calendar, X } from 'lucide-react'
import Link from 'next/link'

// Inline hook to avoid import issues
const useAuth = () => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const t = localStorage.getItem('auth_token')
      const u = localStorage.getItem('auth_user')
      setToken(t)
      if (u) setUser(JSON.parse(u))
    }
  }, [])
  return { token, user }
}

interface StaffMember {
  id: string
  email: string
  fullName: string
  department?: string
}

interface Team {
  id: string
  name: string
  type: 'medical' | 'security' | 'fire' | 'general'
  icon: string
  members: number
  location: string
  eta: string
  staff: StaffMember[]
}

export default function ManageTeamsPage() {
  const { token, user } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const savedToken = localStorage.getItem('auth_token')
      if (!savedToken && !token) {
        redirect('/login')
      }
      if (user?.role !== 'admin') {
        redirect('/admin')
      }
      setIsChecking(false)
    }, 50)
    return () => clearTimeout(checkAuth)
  }, [token, user])

  useEffect(() => {
    if (!isChecking) {
      loadTeams()
    }
  }, [isChecking])

  const loadTeams = async () => {
    try {
      setLoading(true)
      const authToken = localStorage.getItem('auth_token')
      if (!authToken) return

      const res = await fetch('/api/teams', {
        headers: { Authorization: `Bearer ${authToken}` },
      })

      if (!res.ok) throw new Error('Failed to fetch teams')

      const data = await res.json()
      setTeams(data.data || [])
    } catch (err) {
      console.error('Error fetching teams:', err)
      setTeams([])
    } finally {
      setLoading(false)
    }
  }

  const getTeamIcon = (type: string) => {
    switch (type) {
      case 'medical':
        return '🏥'
      case 'security':
        return '🛡️'
      case 'fire':
        return '🚒'
      default:
        return '👤'
    }
  }

  const getTeamColor = (type: string) => {
    switch (type) {
      case 'medical':
        return { bg: 'from-red-600 to-red-800', border: 'border-red-500/50', text: 'text-red-300' }
      case 'security':
        return { bg: 'from-blue-600 to-blue-800', border: 'border-blue-500/50', text: 'text-blue-300' }
      case 'fire':
        return { bg: 'from-orange-600 to-orange-800', border: 'border-orange-500/50', text: 'text-orange-300' }
      default:
        return { bg: 'from-slate-600 to-slate-800', border: 'border-slate-500/50', text: 'text-slate-300' }
    }
  }

  if (isChecking || loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full mx-auto" />
          <p>Loading teams...</p>
        </div>
      </div>
    )
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
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-4">
                <Link
                  href="/admin"
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <ChevronLeft className="w-5 h-5 text-cyan-300" />
                </Link>
                <div>
                  <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                    🛡️ Team Management
                  </h1>
                  <p className="text-sm text-blue-200/60 mt-1">
                    {teams.length} team{teams.length !== 1 ? 's' : ''} • {teams.reduce((sum, t) => sum + t.members, 0)} staff members
                  </p>
                </div>
              </div>
            </div>

            <motion.button
              onClick={loadTeams}
              whileHover={{ scale: 1.05, rotate: 180 }}
              className="p-2.5 hover:bg-white/10 rounded-lg transition-all duration-300"
            >
              <svg
                className="w-5 h-5 text-cyan-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto relative z-10">
        {teams.length === 0 ? (
          <motion.div
            className="text-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Users className="w-16 h-16 mx-auto text-blue-200/30 mb-4" />
            <p className="text-blue-200/60 mb-4">No teams found. Add staff members to create teams automatically.</p>
            <Link
              href="/admin/manage-staff"
              className="inline-block px-6 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold rounded-lg transition-all"
            >
              Add Staff
            </Link>
          </motion.div>
        ) : (
          <motion.div
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
          >
            {teams.map((team, idx) => {
              const colors = getTeamColor(team.type)

              return (
                <motion.div
                  key={team.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  onClick={() => setSelectedTeam(team)}
                  className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-xl border cursor-pointer transition-all duration-300 hover:scale-105"
                  style={{
                    borderColor: `rgba(0, 229, 255, 0.2)`,
                    background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.8), rgba(15, 23, 42, 0.6))',
                  }}
                >
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                    background: `linear-gradient(135deg, rgba(0, 229, 255, 0.05))`,
                  }} />

                  <div className="relative z-10 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${colors.bg} bg-opacity-20`}>
                        <span className="text-2xl">{getTeamIcon(team.type)}</span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-cyan-300">{team.members} members</p>
                      </div>
                    </div>

                    {/* Team Name */}
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{team.name}</h3>
                      <p className="text-xs text-blue-200/60">Department Team</p>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 text-xs text-blue-200/60">
                      <div className="flex justify-between">
                        <span>📍 Location:</span>
                        <span className="text-white">{team.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>⏱️ ETA:</span>
                        <span className="text-cyan-300">{team.eta}</span>
                      </div>
                    </div>

                    {/* Staff Members Preview */}
                    {team.staff.length > 0 && (
                      <div className="pt-4 border-t border-white/10">
                        <p className="text-xs text-blue-200/60 mb-2">Staff Members:</p>
                        <div className="space-y-1">
                          {team.staff.slice(0, 3).map((member) => (
                            <p key={member.id} className="text-xs text-white truncate">
                              • {member.fullName}
                            </p>
                          ))}
                          {team.staff.length > 3 && (
                            <p className="text-xs text-blue-200/60">
                              +{team.staff.length - 3} more
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full mt-4 py-2 px-3 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white text-xs font-bold transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/30"
                    >
                      View Team Details
                    </motion.button>
                  </div>

                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </main>

      {/* Team Detail Modal */}
      {selectedTeam && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelectedTeam(null)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ background: 'rgba(0, 0, 0, 0.5)' }}
        >
          <motion.div
            className="relative max-w-lg w-full max-h-[90vh] overflow-y-auto rounded-3xl backdrop-blur-2xl border p-6"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            style={{
              borderColor: 'rgba(0, 229, 255, 0.2)',
              background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.95), rgba(15, 23, 42, 0.8))',
            }}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${getTeamColor(selectedTeam.type).bg} bg-opacity-20`}>
                    <span className="text-4xl">{getTeamIcon(selectedTeam.type)}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-black text-white">{selectedTeam.name}</h2>
                    <p className="text-sm text-blue-200/60 mt-1">Full team details and members</p>
                  </div>
                </div>
                <motion.button
                  onClick={() => setSelectedTeam(null)}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all"
                >
                  <X className="w-5 h-5 text-blue-200/60" />
                </motion.button>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-blue-200/60 mb-1">👥 Members</p>
                  <p className="text-2xl font-bold text-cyan-300">{selectedTeam.members}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-blue-200/60 mb-1">📍 Location</p>
                  <p className="text-sm font-bold text-white truncate">{selectedTeam.location}</p>
                </div>
                <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <p className="text-xs text-blue-200/60 mb-1">⏱️ ETA</p>
                  <p className="text-2xl font-bold text-cyan-300">{selectedTeam.eta}</p>
                </div>
              </div>

              {/* Staff Members List */}
              <div className="space-y-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-300" />
                  Staff Members ({selectedTeam.staff.length})
                </h3>

                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {selectedTeam.staff.length > 0 ? (
                    selectedTeam.staff.map((member, idx) => (
                      <motion.div
                        key={member.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="p-4 rounded-lg bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                              {member.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">{member.fullName}</p>
                              <p className="text-xs text-blue-200/60 flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {member.email}
                              </p>
                            </div>
                          </div>
                          <div className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                            Active
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <p className="text-center text-blue-200/60 py-8">No staff members in this team</p>
                  )}
                </div>
              </div>

              {/* Close Button */}
              <motion.button
                onClick={() => setSelectedTeam(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-white text-sm font-bold transition-all duration-300"
              >
                Close
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
