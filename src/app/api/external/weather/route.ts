import { NextRequest } from 'next/server'
import { getWeatherData } from '@/lib/external-apis'

export async function GET(req: NextRequest) {
  try {
    const lat = req.nextUrl.searchParams.get('lat') || '25.3548'
    const lon = req.nextUrl.searchParams.get('lon') || '51.5507'

    const weather = await getWeatherData(parseFloat(lat), parseFloat(lon))

    return new Response(JSON.stringify({ success: true, data: weather }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch weather' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
