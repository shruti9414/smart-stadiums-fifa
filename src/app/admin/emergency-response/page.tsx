'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { redirect } from 'next/navigation'

interface EmergencyCall {
  id: string
  type: 'medical' | 'security' | 'fire' | 'other'
  severity: 'critical' | 'high' | 'medium' | 'low'
  location: string
  time: string
  responders: string[]
  status: 'pending' | 'en-route' | 'on-scene' | 'resolved'
  eta: string
  description: string
}

export default function EmergencyResponsePage() {
  const { token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [emergencyCalls, setEmergencyCalls] = useState<EmergencyCall[]>([])
  const [selectedCall, setSelectedCall] = useState<EmergencyCall | null>(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (!savedToken && !token) {
      redirect('/login')
    }
    setIsChecking(false)
    loadEmergencyCalls()
  }, [])

  const loadEmergencyCalls = () => {
    const mockCalls: EmergencyCall[] = [
      {
        id: '1',
        type: 'medical',
        severity: 'critical',
        location: 'North Stand Section 12',
        time: '2 min ago',
        responders: ['Dr. Sharma', 'Nurse Patel', 'EMT Kumar'],
        status: 'on-scene',
        eta: 'On Scene',
        description: 'Visitor experiencing chest pain, consciousness level: alert',
      },
      {
        id: '2',
        type: 'security',
        severity: 'high',
        location: 'East Gate Area',
        time: '5 min ago',
        responders: ['Officer Singh', 'Officer Gupta', 'Supervisor Verma'],
        status: 'en-route',
        eta: '1 min',
        description: 'Unauthorized access attempt detected at restricted area',
      },
      {
        id: '3',
        type: 'fire',
        severity: 'critical',
        location: 'Food Court Kitchen',
        time: '8 min ago',
        responders: ['Fire Chief Yadav', 'Firefighter Mehta', 'Firefighter Singh'],
        status: 'on-scene',
        eta: 'On Scene',
        description: 'Small kitchen fire, sprinklers activated, area evacuating',
      },
      {
        id: '4',
        type: 'medical',
        severity: 'medium',
        location: 'South Stand',
        time: '15 min ago',
        responders: ['Dr. Iyer', 'Nurse Khan'],
        status: 'resolved',
        eta: 'Resolved',
        description: 'Minor injury, first aid provided, visitor stable',
      },
      {
        id: '5',
        type: 'security',
        severity: 'low',
        location: 'Parking Level 2',
        time: '22 min ago',
        responders: ['Officer Rao'],
        status: 'resolved',
        eta: 'Resolved',
        description: 'Vehicle parking violation, ticket issued',
      },
    ]
    setEmergencyCalls(mockCalls)
  }

  if (isChecking) return null

  const activeCalls = emergencyCalls.filter((c) => c.status !== 'resolved').length
  const criticalCalls = emergencyCalls.filter((c) => c.severity === 'critical' && c.status !== 'resolved').length
  const avgResponseTime = '2.3 min'
  const resolutionRate = '96%'

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'en-route':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'on-scene':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
      case 'resolved':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'from-red-600 to-red-400'
      case 'high':
        return 'from-orange-600 to-orange-400'
      case 'medium':
        return 'from-yellow-600 to-yellow-400'
      case 'low':
        return 'from-green-600 to-green-400'
      default:
        return 'from-slate-600 to-slate-400'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold gradient-text">🚨 Emergency Response</h1>
            <p className="text-slate-400 text-sm mt-1">Real-time emergency dispatch and response coordination</p>
          </div>
          <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all shadow-lg animate-pulse">
            📞 Emergency Hotline: 999
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto">
        {/* KPI Cards */}
        <motion.div
          className="grid md:grid-cols-4 gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <KPICard label="Active Calls" value={activeCalls.toString()} icon="📞" color="from-blue-500 to-cyan-500" />
          <KPICard label="Critical" value={criticalCalls.toString()} icon="🚨" color="from-red-500 to-orange-500" />
          <KPICard label="Avg Response" value={avgResponseTime} icon="⏱️" color="from-green-500 to-emerald-500" />
          <KPICard label="Resolution Rate" value={resolutionRate} icon="✓" color="from-purple-500 to-pink-500" />
        </motion.div>

        {/* Live Dispatch Board */}
        <motion.div
          className="rounded-3xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Header */}
          <div className="border-b border-slate-700/50 bg-black/30 px-8 py-6">
            <h2 className="text-2xl font-bold text-white">📋 Live Dispatch Board</h2>
            <p className="text-sm text-slate-400 mt-1">
              {activeCalls} active call{activeCalls !== 1 ? 's' : ''} | {emergencyCalls.length} total today
            </p>
          </div>

          {/* Calls List */}
          <div className="divide-y divide-slate-700/30">
            <AnimatePresence>
              {emergencyCalls.map((call, idx) => (
                <motion.div
                  key={call.id}
                  className="p-6 border-b border-slate-700/20 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => setSelectedCall(call)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <div className="grid grid-cols-12 gap-6 items-center">
                    {/* Emergency Icon & Type */}
                    <div className="col-span-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getSeverityColor(call.severity)} flex items-center justify-center text-xl font-bold animate-pulse`}
                        >
                          {call.type === 'medical' && '🏥'}
                          {call.type === 'security' && '🔒'}
                          {call.type === 'fire' && '🔥'}
                          {call.type === 'other' && '⚠️'}
                        </div>
                        <div>
                          <p className="font-bold text-white capitalize">{call.type}</p>
                          <p className="text-xs text-slate-400">{call.time}</p>
                        </div>
                      </div>
                    </div>

                    {/* Severity Badge */}
                    <div className="col-span-1">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-bold bg-opacity-10 border capitalize ${
                          call.severity === 'critical'
                            ? 'bg-red-500 text-red-300 border-red-500/30'
                            : call.severity === 'high'
                            ? 'bg-orange-500 text-orange-300 border-orange-500/30'
                            : call.severity === 'medium'
                            ? 'bg-yellow-500 text-yellow-300 border-yellow-500/30'
                            : 'bg-green-500 text-green-300 border-green-500/30'
                        }`}
                      >
                        {call.severity}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="col-span-2">
                      <p className="font-semibold text-white text-sm">{call.location}</p>
                      <p className="text-xs text-slate-400">{call.description.substring(0, 40)}...</p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold border ${getStatusColor(call.status)} capitalize`}>
                        {call.status === 'en-route' && '🚗 En Route'}
                        {call.status === 'on-scene' && '👥 On Scene'}
                        {call.status === 'pending' && '⏳ Pending'}
                        {call.status === 'resolved' && '✓ Resolved'}
                      </span>
                    </div>

                    {/* ETA */}
                    <div className="col-span-1">
                      <p className="font-bold text-white text-sm">{call.eta}</p>
                    </div>

                    {/* Responders */}
                    <div className="col-span-2">
                      <div className="flex -space-x-2">
                        {call.responders.slice(0, 3).map((responder, i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900"
                            title={responder}
                          >
                            {responder.charAt(0)}
                          </div>
                        ))}
                        {call.responders.length > 3 && (
                          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white border-2 border-slate-900">
                            +{call.responders.length - 3}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action */}
                    <div className="col-span-1 text-right">
                      <button className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">View →</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </main>

      {/* Call Details Modal */}
      <AnimatePresence>
        {selectedCall && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCall(null)}
          >
            <motion.div
              className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Emergency Call #{selectedCall.id}</h2>
                  <p className="text-slate-400">{selectedCall.time}</p>
                </div>
                <span
                  className={`px-4 py-2 rounded-lg font-bold capitalize text-lg ${
                    selectedCall.severity === 'critical'
                      ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                      : selectedCall.severity === 'high'
                      ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30'
                      : selectedCall.severity === 'medium'
                      ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                      : 'bg-green-500/20 text-green-300 border border-green-500/30'
                  }`}
                >
                  {selectedCall.severity} Severity
                </span>
              </div>

              <div className="space-y-6 mb-8">
                {/* Emergency Details */}
                <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-6">
                  <h3 className="font-bold text-white mb-4 text-lg">📋 Call Details</h3>
                  <div className="space-y-3">
                    <DetailRow label="Type" value={selectedCall.type.charAt(0).toUpperCase() + selectedCall.type.slice(1)} />
                    <DetailRow label="Location" value={selectedCall.location} />
                    <DetailRow label="Description" value={selectedCall.description} />
                    <DetailRow label="Status" value={selectedCall.status.toUpperCase()} />
                    <DetailRow label="ETA" value={selectedCall.eta} />
                  </div>
                </div>

                {/* Response Team */}
                <div className="rounded-lg border border-slate-700/30 bg-slate-800/30 p-6">
                  <h3 className="font-bold text-white mb-4 text-lg">👥 Response Team</h3>
                  <div className="space-y-2">
                    {selectedCall.responders.map((responder, idx) => (
                      <div key={idx} className="flex items-center gap-3 pb-2 border-b border-slate-700/20 last:border-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {responder.charAt(0)}
                        </div>
                        <span className="text-slate-300">{responder}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-4">
                <button className="py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-lg transition-all">
                  Mark Resolved
                </button>
                <button className="py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all">
                  Add Responder
                </button>
                <button
                  onClick={() => setSelectedCall(null)}
                  className="py-3 px-4 bg-slate-700/50 hover:bg-slate-700 text-white font-bold rounded-lg transition-all"
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

function KPICard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
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

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}
