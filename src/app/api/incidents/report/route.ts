import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { incidentSchema } from '@/lib/validators'
import { validateBody, success, error } from '@/lib/api'

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')
    if (!token) return error('Unauthorized', 401)

    const body = await validateBody<any>(req, incidentSchema)
    if (!body) return error('Invalid input')

    // Create incident in database
    const incident = await prisma.incident.create({
      data: {
        type: body.type,
        severity: body.severity,
        location: body.location,
        description: body.description,
        status: 'reported',
        stadiumId: body.stadiumId || 'default-stadium',
      },
    })

    console.log('✓ Incident created in database:', incident.id, '-', incident.type)

    return success(
      {
        incidentId: incident.id,
        status: incident.status,
        createdAt: incident.createdAt,
      },
      201
    )
  } catch (err) {
    console.error('Incident report error:', err)
    return error('Failed to report incident', 500)
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')
    if (!token) return error('Unauthorized', 401)

    const stadiumId = req.nextUrl.searchParams.get('stadiumId') || 'default-stadium'

    // Query incidents from database
    const incidents = await prisma.incident.findMany({
      where: { stadiumId },
      orderBy: { createdAt: 'desc' },
    })

    return success({
      incidents,
      total: incidents.length,
    })
  } catch (err) {
    console.error('Error fetching incidents:', err)
    return error('Failed to fetch incidents', 500)
  }
}
