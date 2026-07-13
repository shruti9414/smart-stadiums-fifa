import { NextRequest } from 'next/server'
import { getSustainabilityMetrics, predictCrowdDensity } from '@/lib/external-apis'

export async function GET(req: NextRequest) {
  try {
    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'lusail-2026'
    const minutes = parseInt(req.nextUrl.searchParams.get('minutesAhead') || '30')

    const [metrics, prediction] = await Promise.all([
      getSustainabilityMetrics(),
      predictCrowdDensity(stadiumId, minutes),
    ])

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          metrics,
          prediction,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch sustainability data' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
