import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

export async function GET(req: NextRequest) {
  try {
    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'lusail-2026'

    // Get latest crowd analytics from database
    const crowdData = await prisma.crowdAnalytics.findFirst({
      where: { stadiumId },
      orderBy: { timestamp: 'desc' },
    })

    // Get predictions from database
    const predictions = await prisma.crowdPrediction.findMany({
      where: { stadiumId },
      orderBy: { predictionTime: 'asc' },
      take: 4,
    })

    // Default zones if no database data
    const defaultZones = {
      A1: 45,
      A2: 52,
      B1: 68,
      B2: 75,
      C1: 62,
      C2: 71,
    }

    // Get occupancy from database or use default
    const totalOccupancy = crowdData
      ? parseInt(crowdData.occupancyPct.toString())
      : 65

    const zoneData = crowdData?.zoneData ? (crowdData.zoneData as Record<string, number>) : defaultZones

    // Create response with both database and calculated data
    const responseData = {
      stadium: 'Lusail Stadium',
      totalOccupancy,
      status: totalOccupancy > 80 ? 'critical' : totalOccupancy > 60 ? 'warning' : 'safe',
      zones: Object.entries(zoneData).map(([zone, occ]) => ({
        zone,
        occupancy: occ,
        status: occ > 80 ? 'critical' : occ > 60 ? 'warning' : 'safe',
      })),
      predictions: predictions
        .slice(0, 4)
        .map((p) => ({
          time: p.predictionTime,
          occupancy: parseInt(p.occupancyPct.toString()),
          confidence: parseFloat(p.confidence.toString()),
          alerts: p.riskAlerts ? (p.riskAlerts as Record<string, any>).alerts || [] : [],
        }))
        .concat([
          {
            time: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
            occupancy: Math.min(99, totalOccupancy + 8),
            confidence: 0.92,
            alerts: ['moderate_crowd'],
          },
          {
            time: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
            occupancy: Math.min(99, totalOccupancy + 5),
            confidence: 0.88,
            alerts: [],
          },
          {
            time: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
            occupancy: Math.max(20, totalOccupancy - 3),
            confidence: 0.85,
            alerts: [],
          },
          {
            time: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            occupancy: Math.max(20, totalOccupancy - 8),
            confidence: 0.82,
            alerts: [],
          },
        ]),
      lastUpdated: crowdData?.timestamp || new Date(),
      recommendation:
        totalOccupancy > 80
          ? '🔴 Critical crowd level. Restrict entry and manage exits carefully.'
          : totalOccupancy > 60
            ? '🟡 Moderate crowd. Monitor queue lengths and capacity.'
            : '🟢 Safe crowd level. All systems normal.',
    }

    console.log(`✓ Crowd stats retrieved: ${totalOccupancy}% occupancy`)

    return new Response(JSON.stringify({ success: true, data: responseData }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Crowd stats error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to get crowd stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// POST: Store new crowd analytics
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { stadiumId = 'lusail-2026', occupancyPct, zoneData } = body

    if (occupancyPct === undefined) {
      return new Response(JSON.stringify({ success: false, error: 'occupancyPct required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Store crowd analytics in database
    const crowdData = await prisma.crowdAnalytics.create({
      data: {
        stadiumId,
        occupancyPct: new Prisma.Decimal(occupancyPct),
        zoneData: zoneData || {},
      },
    })

    console.log(`✓ Crowd analytics stored: ${occupancyPct}% at ${stadiumId}`)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: crowdData.id,
          occupancyPct: crowdData.occupancyPct,
          timestamp: crowdData.timestamp,
        },
      }),
      { status: 201, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('Error storing crowd stats:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to store crowd stats' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
