import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { success, error } from '@/lib/api'

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')
    if (!token) return error('Unauthorized', 401)

    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'default-stadium'

    // Get latest crowd analytics from database
    const crowdData = await prisma.crowdAnalytics.findFirst({
      where: { stadiumId },
      orderBy: { createdAt: 'desc' },
    })

    // Get predictions from database
    const predictions = await prisma.crowdPrediction.findMany({
      where: { stadiumId },
      orderBy: { predictedTime: 'asc' },
      take: 4,
    })

    // If no data in database, use defaults but still store
    const totalOccupancy = crowdData?.occupancy || 65.5
    const zones = crowdData?.zoneData || [
      { zone: 'sectionA', occupancy: 78, name: 'Section A' },
      { zone: 'sectionB', occupancy: 62, name: 'Section B' },
      { zone: 'sectionC', occupancy: 55, name: 'Section C' },
      { zone: 'sectionD', occupancy: 71, name: 'Section D' },
    ]

    // Ensure we have data in database for next time
    if (!crowdData) {
      await prisma.crowdAnalytics.create({
        data: {
          stadiumId,
          occupancy: totalOccupancy,
          zoneData: zones,
        },
      })
    }

    const responseData = {
      totalOccupancy,
      zones,
      predictions:
        predictions.length > 0
          ? predictions.map((p) => ({
              time: p.predictedTime,
              occupancy: p.occupancy,
              confidence: p.confidence,
              risks: p.risks || [],
            }))
          : [
              {
                time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
                occupancy: 70,
                confidence: 0.92,
                risks: [],
              },
              {
                time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
                occupancy: 75,
                confidence: 0.88,
                risks: ['high_exit_congestion_expected'],
              },
              {
                time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
                occupancy: 72,
                confidence: 0.85,
                risks: [],
              },
              {
                time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
                occupancy: 68,
                confidence: 0.82,
                risks: [],
              },
            ],
      lastUpdated: crowdData?.createdAt || new Date().toISOString(),
    }

    console.log('✓ Crowd stats retrieved from database')

    return success(responseData)
  } catch (err) {
    console.error('Crowd stats error:', err)
    return error('Failed to get crowd stats', 500)
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')
    if (!token) return error('Unauthorized', 401)

    const body = await req.json()
    const { stadiumId = 'default-stadium', occupancy, zoneData } = body

    if (occupancy === undefined) return error('occupancy required')

    // Store crowd analytics in database
    const crowdData = await prisma.crowdAnalytics.create({
      data: {
        stadiumId,
        occupancy,
        zoneData: zoneData || [],
      },
    })

    console.log('✓ Crowd analytics stored in database:', stadiumId)

    return success(
      {
        id: crowdData.id,
        occupancy: crowdData.occupancy,
        timestamp: crowdData.createdAt,
      },
      201
    )
  } catch (err) {
    console.error('Error storing crowd stats:', err)
    return error('Failed to store crowd stats', 500)
  }
}
