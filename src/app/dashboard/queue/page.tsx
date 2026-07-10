'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { redirect } from 'next/navigation'

interface Queue {
  id: string
  name: string
  icon: string
  currentWait: number
  maxCapacity: number
  people: number
  trend: 'up' | 'down' | 'stable'
  avgTime: number
}

export default function QueuePage() {
  const { token, user } = useAuth()
  const [isChecking, setIsChecking] = useState(true)
  const [queues, setQueues] = useState<Queue[]>([])
  const [queueAction, setQueueAction] = useState<{ queueId: string; action: string } | null>(null)

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

  const handleQueueAction = (queueId: string, queueName: string, action: string) => {
    setQueueAction({ queueId, action })
    setTimeout(() => {
      alert(`✓ ${action}\n\nQueue: ${queueName}\nNotification set!`)
      setQueueAction(null)
    }, 300)
  }

  useEffect(() => {
    const mockQueues: Queue[] = [
      {
        id: '1',
        name: 'Food Court A',
        icon: '🍽️',
        currentWait: 12,
        maxCapacity: 150,
        people: 85,
        trend: 'up',
        avgTime: 15,
      },
      {
        id: '2',
        name: 'Restroom (Level 1)',
        icon: '🚻',
        currentWait: 5,
        maxCapacity: 40,
        people: 28,
        trend: 'stable',
        avgTime: 8,
      },
      {
        id: '3',
        name: 'Merchandise Shop',
        icon: '🛍️',
        currentWait: 18,
        maxCapacity: 100,
        people: 64,
        trend: 'up',
        avgTime: 20,
      },
      {
        id: '4',
        name: 'VIP Lounge Entry',
        icon: '✨',
        currentWait: 3,
        maxCapacity: 50,
        people: 42,
        trend: 'down',
        avgTime: 5,
      },
      {
        id: '5',
        name: 'Security Check',
        icon: '🔐',
        currentWait: 8,
        maxCapacity: 200,
        people: 142,
        trend: 'stable',
        avgTime: 10,
      },
      {
        id: '6',
        name: 'Guest Services',
        icon: '👥',
        currentWait: 2,
        maxCapacity: 30,
        people: 8,
        trend: 'down',
        avgTime: 4,
      },
    ]
    setQueues(mockQueues)
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '➡️'
    }
  }

  const getWaitColor = (wait: number) => {
    if (wait > 15) return 'text-red-400'
    if (wait > 8) return 'text-yellow-400'
    return 'text-green-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900/50 to-black">
      {/* Header */}
      <header className="border-b border-slate-800/50 bg-black/20 backdrop-blur-xl px-8 py-6 sticky top-0 z-50">
        <h1 className="text-3xl font-bold gradient-text">⏳ Real-Time Queue Status</h1>
        <p className="text-sm text-slate-400 mt-1">Skip the wait - plan your visit strategically</p>
      </header>

      {/* Main Content */}
      <main className="px-8 py-8 max-w-7xl mx-auto space-y-8">
        {/* Quick Tips */}
        <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-green-600/5 backdrop-blur-sm p-6">
          <p className="text-green-300 font-bold mb-2">💡 Pro Tips:</p>
          <div className="grid md:grid-cols-3 gap-3 text-sm text-slate-300">
            <p>• Shortest wait: Guest Services (2 mins) & VIP Lounge (3 mins)</p>
            <p>• Best time to shop: In 30 mins (expected 22 min wait vs current 18)</p>
            <p>• Avoid: Food Court A (growing queue, 12 min wait)</p>
          </div>
        </div>

        {/* Queue Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {queues.map(queue => (
            <div
              key={queue.id}
              className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-6 hover:border-slate-600 transition-all"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{queue.icon}</span>
                  <div>
                    <h3 className="font-bold text-white">{queue.name}</h3>
                    <p className="text-xs text-slate-400">Live status</p>
                  </div>
                </div>
                <span className="text-2xl">{getTrendIcon(queue.trend)}</span>
              </div>

              {/* Wait Time (Big Number) */}
              <div className="mb-4">
                <p className="text-xs text-slate-400 mb-1">Current Wait</p>
                <p className={`text-4xl font-bold ${getWaitColor(queue.currentWait)}`}>
                  {queue.currentWait} min
                </p>
                <p className="text-xs text-slate-500 mt-1">Avg: {queue.avgTime} mins</p>
              </div>

              {/* Capacity Bar */}
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <p className="text-xs text-slate-400">Capacity</p>
                  <p className="text-xs font-bold text-slate-300">{queue.people}/{queue.maxCapacity}</p>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      (queue.people / queue.maxCapacity) * 100 > 80
                        ? 'bg-red-500'
                        : (queue.people / queue.maxCapacity) * 100 > 50
                          ? 'bg-yellow-500'
                          : 'bg-green-500'
                    }`}
                    style={{ width: `${(queue.people / queue.maxCapacity) * 100}%` }}
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  const action = queue.currentWait <= 5 ? '✓ Go Now' : queue.currentWait <= 10 ? '⏱️ Come Soon' : '🔔 Set Reminder'
                  handleQueueAction(queue.id, queue.name, action)
                }}
                className={`w-full rounded-lg px-4 py-2 text-sm font-bold transition-all ${
                  queueAction?.queueId === queue.id
                    ? 'bg-green-500/40 border border-green-500/50 text-green-300'
                    : 'bg-gradient-to-r from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30 text-yellow-300 hover:from-yellow-500/30 hover:to-yellow-600/30'
                }`}
              >
                {queueAction?.queueId === queue.id ? '✓ Saved!' : (queue.currentWait <= 5 ? '✓ Go Now' : queue.currentWait <= 10 ? '⏱️ Come Soon' : '🔔 Set Reminder')}
              </button>
            </div>
          ))}
        </div>

        {/* Advanced Analytics */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Peak Times */}
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8">
            <h3 className="text-lg font-bold text-white mb-6">📊 Peak Times Today</h3>
            <div className="space-y-3">
              {[
                { time: '12:30 PM - 1:30 PM', crowd: 'Very High', icon: '🔴' },
                { time: '6:00 PM - 7:00 PM', crowd: 'High', icon: '🟠' },
                { time: '2:00 PM - 3:00 PM', crowd: 'Medium', icon: '🟡' },
                { time: '5:00 PM - 6:00 PM', crowd: 'Medium', icon: '🟡' },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-700/30">
                  <span className="text-sm text-slate-300">{item.time}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-sm font-bold text-white">{item.crowd}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Recommendations */}
          <div className="rounded-2xl border border-slate-700/50 bg-gradient-to-br from-slate-900/60 to-slate-950/60 backdrop-blur-sm p-8">
            <h3 className="text-lg font-bold text-white mb-6">🎯 Smart Recommendations</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <p className="text-sm font-bold text-green-300 mb-1">✓ Best Time to Shop</p>
                <p className="text-xs text-slate-300">4:00 PM - 5:00 PM (expected 2 min wait)</p>
              </div>
              <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                <p className="text-sm font-bold text-yellow-300 mb-1">⚠️ Avoid This Time</p>
                <p className="text-xs text-slate-300">12:30 PM - 1:30 PM (very crowded)</p>
              </div>
              <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                <p className="text-sm font-bold text-blue-300 mb-1">💡 Pro Tip</p>
                <p className="text-xs text-slate-300">Use mobile order to skip food queue</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
