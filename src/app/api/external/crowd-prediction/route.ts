import { NextRequest } from 'next/server'
import { predictCrowdDensity } from '@/lib/external-apis'

export async function GET(req: NextRequest) {
  try {
    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'lusail-2026'
    const minutesAhead = parseInt(req.nextUrl.searchParams.get('minutesAhead') || '30')

    const prediction = await predictCrowdDensity(stadiumId, minutesAhead)

    return new Response(JSON.stringify({ success: true, data: prediction }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to predict crowd density' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
