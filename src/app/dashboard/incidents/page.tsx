'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useIncidentStore, type Incident } from '@/hooks/useIncidents'
import { redirect } from 'next/navigation'

export default function IncidentsPage() {
  const { token, user } = useAuth()
  const { incidents, addIncident, initializeMockData } = useIncidentStore()
  const [showForm, setShowForm] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'responding' | 'resolved'>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6
  const [formData, setFormData] = useState({
    type: 'medical',
    severity: 'medium',
    location: '',
    description: '',
  })
  const [loading, setLoading] = useState(false)

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
    if (incidents.length === 0) {
      initializeMockData()
    }
  }, [incidents, initializeMockData])

  const getTimeAgo = (isoTime: string) => {
    const minutes = Math.floor((Date.now() - new Date(isoTime).getTime()) / 60000)
    if (minutes < 1) return 'just now'
    if (minutes < 60) return `${minutes}m ago`
    return new Date(isoTime).toLocaleTimeString()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.location.trim() || !formData.description.trim()) {
      alert('Please fill in all fields')
      return
    }
    setLoading(true)

    try {
      const authToken = localStorage.getItem('auth_token')
      const res = await fetch('/api/incidents/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          type: formData.type,
          severity: formData.severity,
          location: formData.location,
          description: formData.description,
          stadiumId: 'default-stadium',
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to report incident')
      }

      const data = await res.json()

      // Also add to local store for immediate UI update
      addIncident({
        type: formData.type as any,
        severity: formData.severity as any,
        location: formData.location,
        description: formData.description,
        status: 'open',
      })

      setFormData({ type: 'medical', severity: 'medium', location: '', description: '' })
      setShowForm(false)
      setCurrentPage(1)
      alert('✓ Incident reported successfully! Staff and Admin can now see it.')
      console.log('✓ Incident saved to database:', data.data.incidentId)
    } catch (err) {
      console.error('Incident submission error:', err)
      alert('Failed to report incident')
    } finally {
      setLoading(false)
    }
  }

  const filteredIncidents = activeFilter === 'all'
    ? incidents
    : incidents.filter(i => i.status === activeFilter)

  const totalPages = Math.ceil(filteredIncidents.length / itemsPerPage)
  const paginatedIncidents = filteredIncidents.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '🔴'
      case 'high':
        return '🟠'
      case 'medium':
        return '🟡'
      default:
        return '🟢'
    }
  }

  const stats = [
    { label: 'Total', value: incidents.length, icon: '📊' },
    { label: 'Open', value: incidents.filter(i => i.status === 'open').length, icon: '🔴' },
    { label: 'Responding', value: incidents.filter(i => i.status === 'responding').length, icon: '🟡' },
    { label: 'Resolved', value: incidents.filter(i => i.status === 'resolved').length, icon: '✓' },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-700 bg-black px-8 py-6 sticky top-0 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold text-cyan-400">🚨 Incidents</h1>
            <p className="text-sm text-gray-400 mt-1">Report and track stadium emergencies</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors"
          >
            {showForm ? '✕ Close' : '+ Report'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-cyan-400">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Report Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 space-y-4 max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-cyan-400">Report Incident</h2>
                <button
                  onClick={() => setShowForm(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-300 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={e => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white hover:border-gray-600 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="medical">🏥 Medical</option>
                    <option value="security">🔒 Security</option>
                    <option value="fire">🔥 Fire</option>
                    <option value="lost_person">👤 Lost Person</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-2">Severity</label>
                  <select
                    value={formData.severity}
                    onChange={e => setFormData(prev => ({ ...prev, severity: e.target.value }))}
                    className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white hover:border-gray-600 focus:border-cyan-400 focus:outline-none"
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🟠 High</option>
                    <option value="critical">🔴 Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="Section A, Gate 3, etc..."
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-600 hover:border-gray-600 focus:border-cyan-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Details about the incident..."
                  rows={3}
                  className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-600 hover:border-gray-600 focus:border-cyan-400 focus:outline-none resize-none"
                  required
                />
              </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white py-2 rounded font-bold transition-colors"
                >
                  {loading ? '⏳ Submitting...' : '📤 Submit'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          {['all', 'open', 'responding', 'resolved'].map(filter => (
            <button
              key={filter}
              onClick={() => {
                setActiveFilter(filter as any)
                setCurrentPage(1)
              }}
              className={`px-4 py-2 rounded font-semibold transition-colors ${
                activeFilter === filter
                  ? 'bg-cyan-600 text-black'
                  : 'bg-gray-900 text-cyan-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {filter === 'all' && `All (${incidents.length})`}
              {filter === 'open' && `Open (${incidents.filter(i => i.status === 'open').length})`}
              {filter === 'responding' && `Responding (${incidents.filter(i => i.status === 'responding').length})`}
              {filter === 'resolved' && `Resolved (${incidents.filter(i => i.status === 'resolved').length})`}
            </button>
          ))}
        </div>

        {/* Incidents Grid */}
        {filteredIncidents.length === 0 ? (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-12 text-center">
            <div className="text-5xl mb-4">🎉</div>
            <p className="text-gray-400">No incidents in this category</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedIncidents.map(incident => (
                <div
                  key={incident.id}
                  className="bg-gray-900 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-colors"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{getSeverityIcon(incident.severity)}</span>
                      <div>
                        <h3 className="font-bold text-white text-sm capitalize">{incident.type.replace('_', ' ')}</h3>
                        <p className="text-xs text-gray-500">{getTimeAgo(incident.time)}</p>
                      </div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      incident.status === 'open' ? 'bg-red-900/50 text-red-300'
                      : incident.status === 'responding' ? 'bg-yellow-900/50 text-yellow-300'
                      : 'bg-green-900/50 text-green-300'
                    }`}>
                      {incident.status}
                    </span>
                  </div>

                  {/* Content */}
                  <p className="text-sm text-gray-300 mb-3 line-clamp-2">{incident.description}</p>

                  {/* Location */}
                  <div className="mb-3 p-2 bg-black rounded text-xs text-gray-400">
                    📍 {incident.location}
                  </div>

                  {/* Severity */}
                  <div className="text-xs text-gray-400">
                    <span className="font-bold">Severity:</span> <span className="text-cyan-400 font-semibold">{incident.severity}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 py-4">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-2 rounded font-semibold ${
                        currentPage === page
                          ? 'bg-cyan-600 text-black'
                          : 'bg-gray-900 border border-gray-700 text-gray-300 hover:border-gray-600'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 bg-gray-900 border border-gray-700 text-gray-300 rounded hover:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
