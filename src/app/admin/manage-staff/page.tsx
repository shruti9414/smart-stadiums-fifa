'use client'

import { useEffect, useState } from 'react'
import { redirect } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, Edit2, ChevronLeft, X, Eye, EyeOff } from 'lucide-react'
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
  createdAt: string
}

export default function ManageStaffPage() {
  const { token, user } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ email: '', password: '', fullName: '', department: 'general' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)

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
      loadStaff()
    }
  }, [isChecking])

  const loadStaff = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/staff', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      const data = await res.json()
      if (data.success) {
        setStaff(data.data)
      }
    } catch (err) {
      console.error('Failed to load staff:', err)
    }
  }

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    try {
      if (!formData.email || !formData.fullName) {
        throw new Error('All fields required')
      }

      const token = localStorage.getItem('auth_token')

      if (editingId) {
        // Update existing staff
        const res = await fetch(`/api/staff/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to update staff')
        }

        setSuccess('✓ Staff member updated successfully!')
      } else {
        // Add new staff
        if (!formData.password) {
          throw new Error('Password required for new staff')
        }

        const res = await fetch('/api/staff', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || 'Failed to add staff')
        }

        setSuccess('✓ Staff member added successfully!')
      }

      setFormData({ email: '', password: '', fullName: '', department: '' })
      setEditingId(null)
      setShowForm(false)
      await loadStaff()

      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save staff')
    } finally {
      setLoading(false)
    }
  }

  const handleEditStaff = (member: StaffMember) => {
    setEditingId(member.id)
    setFormData({
      email: member.email,
      password: '',
      fullName: member.fullName,
      department: member.department || '',
    })
    setShowPassword(false)
    setShowForm(true)
  }

  const handleDeleteStaff = async (id: string) => {
    if (!confirm('Are you sure you want to delete this staff member?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/staff/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!res.ok) throw new Error('Failed to delete')

      setSuccess('✓ Staff member deleted!')
      await loadStaff()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-96 -right-96 w-[800px] h-[800px] bg-gradient-to-br from-cyan-500 to-blue-500 rounded-full blur-3xl opacity-[0.03]"
          animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Header */}
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
            <div className="flex items-center gap-4">
              <Link href="/admin" className="p-2 hover:bg-white/10 rounded-lg transition-all">
                <ChevronLeft className="w-5 h-5 text-cyan-300" />
              </Link>
              <div>
                <h1 className="text-3xl font-black bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  👮 Manage Staff
                </h1>
                <p className="text-sm text-blue-200/60 mt-1">Add, edit, or remove staff members</p>
              </div>
            </div>

            <div className="flex gap-2">
              <motion.button
                onClick={() => setShowForm(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 text-white font-bold flex items-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Staff
              </motion.button>

              <motion.button
                onClick={() => {
                  setError('')
                  setSuccess('⚠️ Note: Demo data resets on server restart (hot reload). Use seeded staff (staff@stadium.com) for consistent testing.')
                  setTimeout(() => setSuccess(''), 5000)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-2 rounded-lg bg-gray-600/40 hover:bg-gray-600/60 text-gray-300 text-sm font-bold border border-gray-600/40 transition-all"
                title="Info about demo persistence"
              >
                ℹ️
              </motion.button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto relative z-10">
        {/* Alerts */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded-lg bg-green-500/10 border border-green-500/30 p-3 text-sm text-green-200"
            >
              {success}
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-200"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Staff Table */}
        <motion.div
          className="rounded-2xl border overflow-hidden backdrop-blur-xl"
          style={{
            borderColor: 'rgba(0, 229, 255, 0.2)',
            background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.8), rgba(15, 23, 42, 0.6))',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {staff.length === 0 ? (
            <div className="p-12 text-center">
              <div className="mb-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-yellow-200 text-sm mb-2">💡 Demo Note:</p>
                <p className="text-yellow-200/70 text-xs">
                  Staff data resets when server restarts (hot reload). For testing, use seeded staff:
                </p>
                <div className="mt-3 space-y-1 text-xs font-mono text-yellow-300">
                  <p>📧 staff@stadium.com / Staff@12345</p>
                  <p>📧 security2@stadium.com / Staff@12345</p>
                </div>
              </div>
              <p className="text-blue-200/60 mb-4">Or add new staff:</p>
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all"
              >
                Add Staff Member
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'rgba(0, 229, 255, 0.1)' }}>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">Department</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-cyan-300">Added</th>
                    <th className="px-6 py-4 text-right text-sm font-bold text-cyan-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member, idx) => (
                    <motion.tr
                      key={member.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b hover:bg-white/5 transition-colors"
                      style={{ borderColor: 'rgba(0, 229, 255, 0.1)' }}
                    >
                      <td className="px-6 py-4 text-white font-semibold">{member.fullName}</td>
                      <td className="px-6 py-4 text-blue-200/60">{member.email}</td>
                      <td className="px-6 py-4 text-blue-200/60 text-sm">
                        <span className="px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold">
                          {member.department === 'medical' && '🏥 Medical'}
                          {member.department === 'security' && '🛡️ Security'}
                          {member.department === 'fire' && '🚒 Fire'}
                          {member.department === 'general' && '👤 General'}
                          {!member.department && '👤 General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-blue-200/60 text-sm">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right flex gap-2 justify-end">
                        <motion.button
                          onClick={() => handleEditStaff(member)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-cyan-500/20 rounded-lg transition-all text-cyan-400"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          onClick={() => handleDeleteStaff(member.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition-all text-red-400"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>

      {/* Add/Edit Staff Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => {
              setShowForm(false)
              setEditingId(null)
              setFormData({ email: '', password: '', fullName: '', department: '' })
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ background: 'rgba(0, 0, 0, 0.5)' }}
          >
            <motion.div
              className="relative max-w-md w-full rounded-3xl backdrop-blur-2xl border p-8"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                borderColor: 'rgba(0, 229, 255, 0.2)',
                background: 'linear-gradient(135deg, rgba(15, 15, 18, 0.95), rgba(15, 23, 42, 0.8))',
              }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? '✏️ Edit Staff Member' : '👤 Add Staff Member'}
                </h2>
                <motion.button
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    setFormData({ email: '', password: '', fullName: '', department: '' })
                  }}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-5 h-5 text-blue-200/60" />
                </motion.button>
              </div>

              <form onSubmit={handleAddStaff} className="space-y-4">
                <div>
                  <label className="block text-sm text-blue-200/60 mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    placeholder="Staff Name"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-blue-200/40 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-blue-200/60 mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="staff@stadium.com"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-blue-200/40 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm text-blue-200/60 mb-2">Department</label>
                  <select
                    value={formData.department || 'general'}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 text-white focus:border-cyan-500 focus:outline-none appearance-none cursor-pointer relative z-50"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23b0bfc7' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 0.75rem center',
                      backgroundSize: '16px 12px',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="general" style={{ backgroundColor: '#1e293b', color: 'white' }}>👤 General</option>
                    <option value="medical" style={{ backgroundColor: '#1e293b', color: 'white' }}>🏥 Medical</option>
                    <option value="security" style={{ backgroundColor: '#1e293b', color: 'white' }}>🛡️ Security</option>
                    <option value="fire" style={{ backgroundColor: '#1e293b', color: 'white' }}>🚒 Fire/Rescue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-blue-200/60 mb-2">
                    Password {editingId && <span className="text-xs text-blue-200/40">(optional - leave empty to keep current)</span>}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editingId ? 'Leave empty to keep current' : '••••••••'}
                      className="w-full px-4 py-2 pr-10 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-blue-200/40 focus:border-cyan-500 focus:outline-none"
                      required={!editingId}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-200/60 hover:text-blue-200 transition-colors"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-500 hover:to-cyan-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-bold transition-all"
                >
                  {loading ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? '✓ Update Staff Member' : '+ Add Staff Member')}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
