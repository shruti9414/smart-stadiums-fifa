import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

interface StreamData {
  type: 'occupancy' | 'incident' | 'queue' | 'ping'
  timestamp: string
  data: any
}

async function getLatestCrowdData(stadiumId: string) {
  const latest = await prisma.crowdAnalytics.findFirst({
    where: { stadiumId },
    orderBy: { timestamp: 'desc' },
  })

  return {
    occupancy: latest ? parseInt(latest.occupancyPct.toString()) : 65,
    zones: (latest?.zoneData as Record<string, number>) || {},
  }
}

async function getRecentIncidents(stadiumId: string, limit: number = 5) {
  const incidents = await prisma.incident.findMany({
    where: { stadiumId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  })

  return incidents.map((i) => ({
    id: i.id,
    type: i.type,
    severity: i.severity,
    description: i.description,
    status: i.status,
  }))
}

async function getQueueStatus(stadiumId: string) {
  const amenities = await prisma.amenity.findMany({
    where: { stadiumId, type: 'food' },
  })

  return amenities.map((a) => ({
    name: a.name,
    queueLength: a.queueLength || 0,
    capacity: a.capacity || 100,
    occupancyPercent: a.queueLength ? Math.round((a.queueLength / (a.capacity || 100)) * 100) : 0,
  }))
}

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    if (!token) {
      return new Response('Unauthorized', { status: 401 })
    }

    await verifyToken(token)

    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'lusail-2026'
    const streamTypes = (req.nextUrl.searchParams.get('types') || 'occupancy,incident,queue').split(',')

    // Setup Server-Sent Events
    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        const sendData = (data: StreamData) => {
          const message = `data: ${JSON.stringify(data)}\n\n`
          controller.enqueue(encoder.encode(message))
        }

        // Send initial connection message
        sendData({
          type: 'ping',
          timestamp: new Date().toISOString(),
          data: { message: 'Connected to live stream', stadiumId },
        })

        // Set up interval for occupancy updates (every 30 seconds)
        const occupancyInterval = setInterval(async () => {
          if (streamTypes.includes('occupancy')) {
            try {
              const crowd = await getLatestCrowdData(stadiumId)
              sendData({
                type: 'occupancy',
                timestamp: new Date().toISOString(),
                data: {
                  occupancy: crowd.occupancy,
                  zones: crowd.zones,
                  status: crowd.occupancy > 80 ? 'critical' : crowd.occupancy > 60 ? 'warning' : 'safe',
                },
              })
            } catch (err) {
              console.error('Error sending occupancy data:', err)
            }
          }
        }, 30000) // Every 30 seconds

        // Set up interval for incident updates (every 60 seconds)
        const incidentInterval = setInterval(async () => {
          if (streamTypes.includes('incident')) {
            try {
              const incidents = await getRecentIncidents(stadiumId, 3)
              if (incidents.length > 0) {
                sendData({
                  type: 'incident',
                  timestamp: new Date().toISOString(),
                  data: { incidents, count: incidents.length },
                })
              }
            } catch (err) {
              console.error('Error sending incident data:', err)
            }
          }
        }, 60000) // Every 60 seconds

        // Set up interval for queue updates (every 60 seconds)
        const queueInterval = setInterval(async () => {
          if (streamTypes.includes('queue')) {
            try {
              const queues = await getQueueStatus(stadiumId)
              if (queues.length > 0) {
                const busyQueues = queues.filter((q) => q.occupancyPercent > 50)
                if (busyQueues.length > 0) {
                  sendData({
                    type: 'queue',
                    timestamp: new Date().toISOString(),
                    data: {
                      busyQueues: busyQueues,
                      allQueues: queues,
                    },
                  })
                }
              }
            } catch (err) {
              console.error('Error sending queue data:', err)
            }
          }
        }, 60000) // Every 60 seconds

        // Keep-alive ping every 30 seconds
        const pingInterval = setInterval(() => {
          sendData({
            type: 'ping',
            timestamp: new Date().toISOString(),
            data: { message: 'keep-alive' },
          })
        }, 30000)

        // Cleanup on connection close
        req.signal.addEventListener('abort', () => {
          clearInterval(occupancyInterval)
          clearInterval(incidentInterval)
          clearInterval(queueInterval)
          clearInterval(pingInterval)
          controller.close()
        })
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    })
  } catch (err: any) {
    console.error('Stream error:', err.message)
    return new Response(`event: error\ndata: ${err.message}\n\n`, {
      status: 500,
      headers: { 'Content-Type': 'text/event-stream' },
    })
  }
}
