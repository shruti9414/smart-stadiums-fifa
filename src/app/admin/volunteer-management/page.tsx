'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { redirect } from 'next/navigation'

interface Volunteer {
  id: string
  name: string
  email: string
  phone: string
  department: string
  role: string
  shiftStart: string
  shiftEnd: string
  status: 'active' | 'break' | 'off-duty'
  tasksCompleted: number
  hoursWorked: number
  joinedDate: string
}

export default function VolunteerManagementPage() {
  const { token } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [filteredVolunteers, setFilteredVolunteers] = useState<Volunteer[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepartment, setSelectedDepartment] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null)

  const departments = ['Security', 'Medical', 'Guest Services', 'Logistics', 'Technical']
  const roles = ['Coordinator', 'Team Lead', 'Support Staff', 'Intern']

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token')
    if (!savedToken && !token) {
      redirect('/login')
    }
    setIsChecking(false)
    loadVolunteers()
  }, [])

  const loadVolunteers = () => {
    const mockVolunteers: Volunteer[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1-234-567-8901',
        department: 'Security',
        role: 'Team Lead',
        shiftStart: '08:00 AM',
        shiftEnd: '04:00 PM',
        status: 'active',
        tasksCompleted: 12,
        hoursWorked: 8,
        joinedDate: '2026-06-01',
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+1-234-567-8902',
        department: 'Medical',
        role: 'Coordinator',
        shiftStart: '06:00 AM',
        shiftEnd: '02:00 PM',
        status: 'active',
        tasksCompleted: 8,
        hoursWorked: 8,
        joinedDate: '2026-05-15',
      },
      {
        id: '3',
        name: 'Michael Chen',
        email: 'michael@example.com',
        phone: '+1-234-567-8903',
        department: 'Guest Services',
        role: 'Support Staff',
        shiftStart: '10:00 AM',
        shiftEnd: '06:00 PM',
        status: 'break',
        tasksCompleted: 5,
        hoursWorked: 7,
        joinedDate: '2026-06-10',
      },
      {
        id: '4',
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        phone: '+1-234-567-8904',
        department: 'Logistics',
        role: 'Team Lead',
        shiftStart: '07:00 AM',
        shiftEnd: '03:00 PM',
        status: 'active',
        tasksCompleted: 15,
        hoursWorked: 8,
        joinedDate: '2026-05-20',
      },
      {
        id: '5',
        name: 'David Park',
        email: 'david@example.com',
        phone: '+1-234-567-8905',
        department: 'Technical',
        role: 'Support Staff',
        shiftStart: '09:00 AM',
        shiftEnd: '05:00 PM',
        status: 'off-duty',
        tasksCompleted: 3,
        hoursWorked: 6,
        joinedDate: '2026-06-15',
      },
    ]
    setVolunteers(mockVolunteers)
    setFilteredVolunteers(mockVolunteers)
  }

  useEffect(() => {
    let filtered = volunteers

    if (searchQuery) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          v.phone.includes(searchQuery)
      )
    }

    if (selectedDepartment !== 'all') {
      filtered = filtered.filter((v) => v.department === selectedDepartment)
    }

    setFilteredVolunteers(filtered)
  }, [searchQuery, selectedDepartment, volunteers])

  if (isChecking) return null

  const totalVolunteers = volunteers.length
  const activeVolunteers = volunteers.filter((v) => v.status === 'active').length
  const onBreak = volunteers.filter((v) => v.status === 'break').length
  const totalHours = volunteers.reduce((sum, v) => sum + v.hoursWorked, 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold gradient-text">👥 Volunteer Management</h1>
            <p className="text-slate-400 text-sm mt-1">Manage and coordinate volunteer workforce</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all"
          >
            ➕ Add Volunteer
          </button>
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
          <StatsCard label="Total Volunteers" value={totalVolunteers.toString()} icon="👥" trend="Active workforce" />
          <StatsCard label="Currently Active" value={activeVolunteers.toString()} icon="✓" trend="On duty" color="from-green-500 to-emerald-500" />
          <StatsCard label="On Break" value={onBreak.toString()} icon="☕" trend="Resting" color="from-yellow-500 to-orange-500" />
          <StatsCard label="Total Hours" value={totalHours.toString()} icon="⏱️" trend="This event" color="from-purple-500 to-pink-500" />
        </motion.div>

        {/* Filters */}
        <motion.div
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="grid md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Search</label>
              <input
                type="text"
                placeholder="Name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {/* Department Filter */}
            <div>
              <label className="block text-sm font-semibold text-slate-300 mb-2">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="all">All Departments</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Results */}
            <div className="flex items-end">
              <div className="text-slate-300">
                <p className="text-sm">Showing {filteredVolunteers.length} of {volunteers.length} volunteers</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Volunteers Table */}
        <motion.div
          className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-slate-700/50 bg-black/30">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">Volunteer</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">Department</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">Shift</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">Tasks</th>
                  <th className="text-left px-6 py-4 text-sm font-bold text-slate-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                <AnimatePresence>
                  {filteredVolunteers.map((volunteer, idx) => (
                    <motion.tr
                      key={volunteer.id}
                      className="hover:bg-slate-800/30 transition-all"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.05 }}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-white">{volunteer.name}</p>
                          <p className="text-xs text-slate-400">{volunteer.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-sm text-white">{volunteer.department}</p>
                          <p className="text-xs text-slate-400">{volunteer.role}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-slate-300">
                          {volunteer.shiftStart} - {volunteer.shiftEnd}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                            volunteer.status === 'active'
                              ? 'bg-green-500/20 text-green-300'
                              : volunteer.status === 'break'
                              ? 'bg-yellow-500/20 text-yellow-300'
                              : 'bg-slate-700/50 text-slate-300'
                          }`}
                        >
                          {volunteer.status === 'active' && '✓ Active'}
                          {volunteer.status === 'break' && '☕ Break'}
                          {volunteer.status === 'off-duty' && 'Off Duty'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-white">{volunteer.tasksCompleted}</p>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedVolunteer(volunteer)}
                          className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition-colors"
                        >
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      {/* Volunteer Details Modal */}
      <AnimatePresence>
        {selectedVolunteer && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVolunteer(null)}
          >
            <motion.div
              className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm w-full max-w-md p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">{selectedVolunteer.name}</h2>

              <div className="space-y-4 mb-6">
                <DetailRow label="Email" value={selectedVolunteer.email} />
                <DetailRow label="Phone" value={selectedVolunteer.phone} />
                <DetailRow label="Department" value={selectedVolunteer.department} />
                <DetailRow label="Role" value={selectedVolunteer.role} />
                <DetailRow label="Shift" value={`${selectedVolunteer.shiftStart} - ${selectedVolunteer.shiftEnd}`} />
                <DetailRow label="Hours Worked" value={`${selectedVolunteer.hoursWorked} hours`} />
                <DetailRow label="Tasks Completed" value={selectedVolunteer.tasksCompleted.toString()} />
                <DetailRow label="Joined" value={selectedVolunteer.joinedDate} />
              </div>

              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all">
                  Edit Profile
                </button>
                <button className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700">
                  View History
                </button>
                <button
                  onClick={() => setSelectedVolunteer(null)}
                  className="w-full px-4 py-2 bg-slate-700/50 hover:bg-slate-700 text-white font-bold rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Volunteer Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900 to-slate-950 backdrop-blur-sm w-full max-w-lg p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Add New Volunteer</h2>

              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50"
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50"
                />

                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-400 rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50"
                />

                <select className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50">
                  <option>Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>

                <select className="w-full bg-slate-800/50 border border-slate-700/50 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cyan-500/50">
                  <option>Select Role</option>
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all"
                  >
                    Add Volunteer
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-lg transition-all border border-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatsCard({
  label,
  value,
  icon,
  trend,
  color = 'from-blue-500 to-cyan-500',
}: {
  label: string
  value: string
  icon: string
  trend: string
  color?: string
}) {
  return (
    <div className={`rounded-xl border bg-gradient-to-br ${color} border-current/30 p-6 text-white shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden relative`}>
      <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-all" />
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-sm font-semibold opacity-90">{label}</p>
          </div>
          <span className="text-2xl">{icon}</span>
        </div>
        <p className="text-3xl font-black mb-2">{value}</p>
        <p className="text-xs opacity-80">{trend}</p>
      </div>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center pb-3 border-b border-slate-700/30">
      <span className="text-slate-400 text-sm">{label}</span>
      <span className="text-white font-semibold">{value}</span>
    </div>
  )
}
