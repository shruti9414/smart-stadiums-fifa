import { NextRequest } from 'next/server'
import { getTransitOptions } from '@/lib/external-apis'

export async function GET(req: NextRequest) {
  try {
    const origin = req.nextUrl.searchParams.get('origin') || 'Doha City Center'
    const destination = req.nextUrl.searchParams.get('destination') || 'Lusail Stadium'
    const passengers = parseInt(req.nextUrl.searchParams.get('passengers') || '1')

    const options = await getTransitOptions(origin, destination, passengers)

    return new Response(JSON.stringify({ success: true, data: options }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch transit options' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
