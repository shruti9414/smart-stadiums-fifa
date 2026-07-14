'use client'

import { useEffect, useRef, useState } from 'react'
import { redirect } from 'next/navigation'

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

interface EcoMetric {
  name: string
  icon: string
  value: string
  target: string
  progress: number
  description: string
  color: string
}

export default function SustainabilityPage() {
  const { token, user } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [metrics, setMetrics] = useState<EcoMetric[]>([])
  const animationFrameRef = useRef(0)

  useEffect(() => {
    const checkAuth = setTimeout(() => {
      const savedToken = localStorage.getItem('auth_token')
      if (!savedToken && !token) {
        redirect('/login')
      }
      setIsChecking(false)
    }, 50)
    return () => clearTimeout(checkAuth)
  }, [token, user])

  useEffect(() => {
    const ecoMetrics: EcoMetric[] = [
      {
        name: 'Carbon Footprint Reduced',
        icon: '💨',
        value: '1,245 tons',
        target: '2,000 tons',
        progress: 62,
        description: 'CO2 offset through renewable energy and sustainable practices',
        color: 'from-green-500 to-emerald-500',
      },
      {
        name: 'Renewable Energy',
        icon: '⚡',
        value: '78%',
        target: '100%',
        progress: 78,
        description: 'Stadium powered by solar and wind energy',
        color: 'from-yellow-500 to-orange-500',
      },
      {
        name: 'Waste Diverted',
        icon: '♻️',
        value: '5,230 kg',
        target: '8,000 kg',
        progress: 65,
        description: 'Total waste recycled, composted, or reused',
        color: 'from-blue-500 to-cyan-500',
      },
      {
        name: 'Water Saved',
        icon: '💧',
        value: '125,000 L',
        target: '200,000 L',
        progress: 62,
        description: 'Water conserved through efficient systems',
        color: 'from-purple-500 to-pink-500',
      },
    ]
    setMetrics(ecoMetrics)
  }, [])

  // Animated eco dashboard
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight

      // Background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, '#0f172a')
      gradient.addColorStop(1, '#0a0e27')
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated eco elements
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Central sun (renewable energy)
      const sunGlow = Math.sin(animationFrameRef.current * 0.05) * 5 + 15
      const sunGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 50 + sunGlow)
      sunGradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)')
      sunGradient.addColorStop(1, 'rgba(251, 191, 36, 0)')
      ctx.fillStyle = sunGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 50 + sunGlow, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2)
      ctx.fill()

      // Orbiting elements (renewable sources)
      const orbitRadius = 80
      const sources = [
        { icon: '🔆', label: 'Solar', angle: animationFrameRef.current * 0.02 },
        { icon: '💨', label: 'Wind', angle: animationFrameRef.current * 0.02 + Math.PI * 0.5 },
        { icon: '💧', label: 'Hydro', angle: animationFrameRef.current * 0.02 + Math.PI },
        { icon: '🌱', label: 'Bio', angle: animationFrameRef.current * 0.02 + Math.PI * 1.5 },
      ]

      sources.forEach(source => {
        const x = centerX + Math.cos(source.angle) * orbitRadius
        const y = centerY + Math.sin(source.angle) * orbitRadius

        ctx.fillStyle = 'rgba(16, 185, 129, 0.3)'
        ctx.beginPath()
        ctx.arc(x, y, 20, 0, Math.PI * 2)
        ctx.fill()

        ctx.font = 'bold 24px Arial'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(source.icon, x, y)

        ctx.font = '10px Arial'
        ctx.fillStyle = '#10b981'
        ctx.fillText(source.label, x, y + 30)
      })

      // Stats around the circle
      const stats = [
        { value: '78%', label: 'Renewable', x: centerX - 120, y: centerY - 80 },
        { value: '62%', label: 'Carbon', x: centerX + 120, y: centerY - 80 },
        { value: '65%', label: 'Waste', x: centerX - 120, y: centerY + 80 },
        { value: '62%', label: 'Water', x: centerX + 120, y: centerY + 80 },
      ]

      stats.forEach(stat => {
        ctx.fillStyle = 'rgba(30, 41, 59, 0.8)'
        ctx.fillRect(stat.x - 35, stat.y - 25, 70, 50)

        ctx.strokeStyle = '#10b981'
        ctx.lineWidth = 2
        ctx.strokeRect(stat.x - 35, stat.y - 25, 70, 50)

        ctx.font = 'bold 18px Arial'
        ctx.textAlign = 'center'
        ctx.fillStyle = '#10b981'
        ctx.fillText(stat.value, stat.x, stat.y - 5)

        ctx.font = '10px Arial'
        ctx.fillStyle = '#94a3b8'
        ctx.fillText(stat.label, stat.x, stat.y + 10)
      })

      animationFrameRef.current += 1
      requestAnimationFrame(animate)
    }

    const id = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(id)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <h1 className="text-3xl font-bold gradient-text">🌱 Green Stadium Initiative</h1>
        <p className="text-sm text-slate-400 mt-1">Sustainability & Environmental Impact</p>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Animated Eco Dashboard */}
        <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm overflow-hidden">
          <canvas
            ref={canvasRef}
            className="w-full h-96"
            style={{ display: 'block' }}
          />
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 gap-6">
          {metrics.map((metric, idx) => (
            <div key={idx} className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 hover:border-green-500/50 transition-all">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl">{metric.icon}</span>
                <div>
                  <h3 className="font-bold text-white">{metric.name}</h3>
                  <p className="text-sm text-slate-400">{metric.description}</p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-lg font-bold text-white">{metric.value}</span>
                  <span className="text-sm text-slate-400">Target: {metric.target}</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-500`}
                    style={{ width: `${metric.progress}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{metric.progress}% towards goal</p>
              </div>
            </div>
          ))}
        </div>

        {/* Eco Tips */}
        <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm p-8">
          <h2 className="text-2xl font-bold text-white mb-6">♻️ How You Can Help</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/20">
              <p className="font-bold text-green-300 mb-2">🚴 Use Public Transport</p>
              <p className="text-sm text-slate-300">Take metro or bus to reduce your carbon footprint by 80%</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/20">
              <p className="font-bold text-green-300 mb-2">♻️ Recycle Everything</p>
              <p className="text-sm text-slate-300">Use designated recycling bins for plastic, paper, and glass</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/20">
              <p className="font-bold text-green-300 mb-2">💧 Save Water</p>
              <p className="text-sm text-slate-300">Use taps wisely and report any leaks to staff immediately</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/20">
              <p className="font-bold text-green-300 mb-2">🌱 Go Vegetarian</p>
              <p className="text-sm text-slate-300">Plant-based meals reduce carbon by 50% vs. meat options</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/20">
              <p className="font-bold text-green-300 mb-2">🔌 Save Energy</p>
              <p className="text-sm text-slate-300">Turn off lights and keep digital devices powered down</p>
            </div>
            <div className="p-4 rounded-lg bg-black/30 border border-green-500/20">
              <p className="font-bold text-green-300 mb-2">👥 Spread Awareness</p>
              <p className="text-sm text-slate-300">Share your eco-friendly actions and inspire others</p>
            </div>
          </div>
        </div>

        {/* Impact Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 text-center">
            <p className="text-3xl font-bold text-yellow-400">45,000</p>
            <p className="text-sm text-slate-400">Trees Planted</p>
          </div>
          <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 text-center">
            <p className="text-3xl font-bold text-green-400">2.3M</p>
            <p className="text-sm text-slate-400">Kg CO2 Offset</p>
          </div>
          <div className="rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 text-center">
            <p className="text-3xl font-bold text-cyan-400">100K+</p>
            <p className="text-sm text-slate-400">Eco-Warriors</p>
          </div>
        </div>
      </main>
    </div>
  )
}
