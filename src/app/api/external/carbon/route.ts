import { NextRequest } from 'next/server'
import { calculateCarbonFootprint } from '@/lib/external-apis'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { visitors = 1, primaryTransport = 'metro', distance = 15 } = body

    const carbon = await calculateCarbonFootprint(visitors, primaryTransport, distance)

    return new Response(JSON.stringify({ success: true, data: carbon }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to calculate carbon' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
