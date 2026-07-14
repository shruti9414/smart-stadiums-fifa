'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

interface StaffMember {
  id: string
  name: string
  department: string
  avatar: string
  responseTime: number
  incidentsHandled: number
  rating: number
  hoursWorked: number
  status: 'online' | 'break' | 'offline'
  efficiency: number
}

export default function StaffPerformancePage() {
  const { token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [sortBy, setSortBy] = useState<'efficiency' | 'rating' | 'incidents'>('efficiency')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (!savedToken && !token) {
      redirect('/login')
    }
    setIsChecking(false)
    loadStaffData()
  }, [])

  const loadStaffData = () => {
    const mockStaff: StaffMember[] = [
      {
        id: '1',
        name: 'Priya Sharma',
        department: 'Security',
        avatar: '👮‍♀️',
        responseTime: 45,
        incidentsHandled: 23,
        rating: 4.8,
        hoursWorked: 40,
        status: 'online',
        efficiency: 94,
      },
      {
        id: '2',
        name: 'Ravi Kumar',
        department: 'Medical',
        avatar: '👨‍⚕️',
        responseTime: 60,
        incidentsHandled: 18,
        rating: 4.6,
        hoursWorked: 35,
        status: 'online',
        efficiency: 88,
      },
      {
        id: '3',
        name: 'Anjali Singh',
        department: 'Guest Services',
        avatar: '👩‍💼',
        responseTime: 50,
        incidentsHandled: 31,
        rating: 4.9,
        hoursWorked: 42,
        status: 'online',
        efficiency: 92,
      },
      {
        id: '4',
        name: 'Vikram Patel',
        department: 'Logistics',
        avatar: '👨‍💼',
        responseTime: 75,
        incidentsHandled: 12,
        rating: 4.3,
        hoursWorked: 40,
        status: 'break',
        efficiency: 78,
      },
      {
        id: '5',
        name: 'Neha Gupta',
        department: 'Technical',
        avatar: '👩‍💻',
        responseTime: 55,
        incidentsHandled: 15,
        rating: 4.7,
        hoursWorked: 38,
        status: 'online',
        efficiency: 90,
      },
      {
        id: '6',
        name: 'Arjun Verma',
        department: 'Security',
        avatar: '👮',
        responseTime: 40,
        incidentsHandled: 28,
        rating: 4.5,
        hoursWorked: 41,
        status: 'online',
        efficiency: 91,
      },
    ]

    const sorted = [...mockStaff].sort((a, b) => {
      if (sortBy === 'efficiency') return b.efficiency - a.efficiency
      if (sortBy === 'rating') return b.rating - a.rating
      return b.incidentsHandled - a.incidentsHandled
    })

    setStaffMembers(sorted)
  }

  if (isChecking) return null

  const avgEfficiency = Math.round(staffMembers.reduce((sum, s) => sum + s.efficiency, 0) / staffMembers.length)
  const avgRating = (staffMembers.reduce((sum, s) => sum + s.rating, 0) / staffMembers.length).toFixed(1)
  const onlineCount = staffMembers.filter((s) => s.status === 'online').length
  const totalIncidents = staffMembers.reduce((sum, s) => sum + s.incidentsHandled, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold gradient-text">📈 Staff Performance</h1>
            <p className="text-slate-400 text-sm mt-1">Track staff efficiency, ratings, and response times</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto">
        {/* Quick Stats */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <KPICard label="Avg Efficiency" value={`${avgEfficiency}%`} icon="⚡" color="from-blue-500 to-cyan-500" />
          <KPICard label="Avg Rating" value={avgRating} icon="⭐" color="from-yellow-500 to-orange-500" />
          <KPICard label="Online Staff" value={onlineCount.toString()} icon="👥" color="from-green-500 to-emerald-500" />
          <KPICard label="Total Incidents Handled" value={totalIncidents.toString()} icon="✓" color="from-purple-500 to-pink-500" />
        </motion.div>

        {/* Sort Controls */}
        <motion.div
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 mb-8 flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <button
            onClick={() => {
              setSortBy('efficiency')
              loadStaffData()
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'efficiency'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600/50'
            }`}
          >
            Sort by Efficiency
          </button>
          <button
            onClick={() => {
              setSortBy('rating')
              loadStaffData()
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'rating'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600/50'
            }`}
          >
            Sort by Rating
          </button>
          <button
            onClick={() => {
              setSortBy('incidents')
              loadStaffData()
            }}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              sortBy === 'incidents'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                : 'bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:border-slate-600/50'
            }`}
          >
            Sort by Incidents
          </button>
        </motion.div>

        {/* Staff Grid */}
        <motion.div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnimatePresence>
            {staffMembers.map((staff, idx) => (
              <motion.div
                key={staff.id}
                className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 hover:border-slate-600/50 transition-all cursor-pointer group"
                onClick={() => setSelectedStaff(staff)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: idx * 0.05 }}
                whileHover={{ y: -5, borderColor: 'rgba(59, 130, 246, 0.3)' }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{staff.avatar}</span>
                    <div>
                      <h3 className="font-bold text-white">{staff.name}</h3>
                      <p className="text-xs text-slate-400">{staff.department}</p>
                    </div>
                  </div>
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      staff.status === 'online'
                        ? 'bg-green-500 animate-pulse'
                        : staff.status === 'break'
                        ? 'bg-yellow-500'
                        : 'bg-slate-500'
                    }`}
                  />
                </div>

                {/* Metrics */}
                <div className="space-y-3 mb-4">
                  {/* Efficiency */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold text-slate-300">Efficiency</span>
                      <span className="text-sm font-bold text-cyan-300">{staff.efficiency}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${staff.efficiency}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  {/* Rating */}
                  <div>
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-slate-300">Rating</span>
                      <span className="text-sm font-bold">⭐ {staff.rating}/5</span>
                    </div>
                  </div>

                  {/* Response Time */}
                  <div>
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-slate-300">Avg Response</span>
                      <span className="text-sm font-bold text-emerald-300">{staff.responseTime}s</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Stats */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700/30">
                  <div>
                    <p className="text-xs text-slate-400">Incidents</p>
                    <p className="text-lg font-bold text-white">{staff.incidentsHandled}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400">Hours</p>
                    <p className="text-lg font-bold text-white">{staff.hoursWorked}h</p>
                  </div>
                </div>

                {/* View Button */}
                <button className="w-full mt-4 py-2 px-4 bg-slate-800/50 hover:bg-slate-800 text-white font-semibold rounded-lg transition-all text-sm border border-slate-700/50">
                  View Details
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </main>

      {/* Staff Details Modal */}
      <AnimatePresence>
        {selectedStaff && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedStaff(null)}
          >
            <motion.div
              className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-6 mb-8">
                <span className="text-6xl">{selectedStaff.avatar}</span>
                <div>
                  <h2 className="text-3xl font-bold text-white">{selectedStaff.name}</h2>
                  <p className="text-lg text-slate-400 mb-2">{selectedStaff.department}</p>
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-sm font-bold ${
                      selectedStaff.status === 'online'
                        ? 'bg-green-500/20 text-green-300'
                        : selectedStaff.status === 'break'
                        ? 'bg-yellow-500/20 text-yellow-300'
                        : 'bg-slate-700/50 text-slate-300'
                    }`}
                  >
                    {selectedStaff.status === 'online' && '🟢 Online'}
                    {selectedStaff.status === 'break' && '☕ On Break'}
                    {selectedStaff.status === 'offline' && 'Offline'}
                  </span>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Performance Metrics */}
                <div className="space-y-4">
                  <h3 className="font-bold text-white text-lg mb-4">Performance Metrics</h3>

                  <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-slate-300">Efficiency Score</span>
                      <span className="font-bold text-cyan-300">{selectedStaff.efficiency}%</span>
                    </div>
                    <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-cyan-600 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${selectedStaff.efficiency}%` }}
                        transition={{ duration: 1 }}
                      />
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Customer Rating</span>
                      <span className="font-bold text-yellow-300">⭐ {selectedStaff.rating}/5.0</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Avg Response Time</span>
                      <span className="font-bold text-emerald-300">{selectedStaff.responseTime}s</span>
                    </div>
                  </div>
                </div>

                {/* Work Stats */}
                <div className="space-y-4">
                  <h3 className="font-bold text-white text-lg mb-4">Work Statistics</h3>

                  <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Incidents Handled</span>
                      <span className="font-bold text-white text-lg">{selectedStaff.incidentsHandled}</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Hours Worked</span>
                      <span className="font-bold text-white text-lg">{selectedStaff.hoursWorked}h</span>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-4">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Incidents per Hour</span>
                      <span className="font-bold text-white text-lg">
                        {(selectedStaff.incidentsHandled / selectedStaff.hoursWorked).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all">
                  Award Recognition
                </button>
                <button className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700">
                  Schedule Shift
                </button>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white font-bold rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function KPICard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: string
  icon: string
  color: string
}) {
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${color} border-current/30 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative`}>
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <p className="text-sm font-semibold opacity-90">{label}</p>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-black">{value}</p>
      </div>
    </div>
  )
}
