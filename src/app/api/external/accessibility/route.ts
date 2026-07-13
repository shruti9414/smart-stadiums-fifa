import { NextRequest } from 'next/server'
import { getAccessibilityServices } from '@/lib/external-apis'

export async function GET(req: NextRequest) {
  try {
    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'lusail-2026'

    const services = await getAccessibilityServices(stadiumId)

    return new Response(JSON.stringify({ success: true, data: services }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch accessibility services' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
