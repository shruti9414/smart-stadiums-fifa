import { NextRequest } from 'next/server'
import { navigationSchema } from '@/lib/validators'
import { validateBody, success, error } from '@/lib/api'
import { calculateDistance } from '@/lib/utils'

// Mock POIs
const MOCK_POIS: Record<string, any> = {
  'poi_entrance': {
    id: 'poi_entrance',
    name: 'Main Entrance',
    coordinates: { lat: 19.2622, lng: -99.0818 },
    accessibility: 'wheelchair_accessible',
  },
  'poi_restroom_a': {
    id: 'poi_restroom_a',
    name: 'Restroom Section A',
    coordinates: { lat: 19.2630, lng: -99.0820 },
    accessibility: 'wheelchair_accessible',
  },
  'poi_food': {
    id: 'poi_food',
    name: 'Food Court',
    coordinates: { lat: 19.2615, lng: -99.0810 },
    accessibility: 'accessible',
  },
  'poi_medical': {
    id: 'poi_medical',
    name: 'Medical Center',
    coordinates: { lat: 19.2635, lng: -99.0825 },
    accessibility: 'wheelchair_accessible',
  },
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')
    if (!token) return error('Unauthorized', 401)

    const body = await validateBody<any>(req, navigationSchema)
    if (!body) return error('Invalid input')

    const fromPOI = MOCK_POIS[body.from]
    const toPOI = MOCK_POIS[body.to]

    if (!fromPOI || !toPOI) return error('POI not found', 404)

    const distance = calculateDistance(
      fromPOI.coordinates.lat,
      fromPOI.coordinates.lng,
      toPOI.coordinates.lat,
      toPOI.coordinates.lng
    )
    const estimatedTime = Math.ceil(distance / 1000 * 12) // ~1.2 min per 100m

    return success({
      from: fromPOI.name,
      to: toPOI.name,
      distance: `${(distance * 1000).toFixed(0)}m`,
      estimatedTime: `${estimatedTime} min`,
      accessibility: fromPOI.accessibility,
      path: [fromPOI.coordinates, toPOI.coordinates],
    })
  } catch (err) {
    console.error('Navigation error:', err)
    return error('Failed to calculate route', 500)
  }
}
