import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function verifyAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return null
  }
  const payload = await verifyToken(token)
  return payload
}

export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { incidentId, teamType, location, eta, notes } = body

    if (!incidentId || !teamType) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Check if incident exists
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
    })

    if (!incident) {
      return new Response(JSON.stringify({ success: false, error: 'Incident not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Create dispatch record
    const dispatch = await prisma.dispatch.create({
      data: {
        incidentId,
        teamType,
        status: 'dispatched',
        location: location || incident.location,
        eta: eta || getETAForTeamType(teamType),
        dispatchedBy: auth.userId as string,
        notes,
      },
    })

    console.log('✓ Dispatch created:', dispatch.id, teamType)

    return new Response(
      JSON.stringify({
        success: true,
        data: dispatch,
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Dispatch error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to create dispatch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Get query params
    const url = new URL(req.url)
    const incidentId = url.searchParams.get('incidentId')

    let where: any = {}
    if (incidentId) {
      where.incidentId = incidentId
    }

    // Get all dispatches (or filtered by incident)
    const dispatches = await prisma.dispatch.findMany({
      where,
      include: {
        incident: true,
      },
      orderBy: { dispatchedAt: 'desc' },
      take: 50,
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: dispatches,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Get dispatches error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch dispatches' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// Patch to update dispatch status
export async function PATCH(req: NextRequest) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const body = await req.json()
    const { dispatchId, status, arrivedAt, completedAt, notes } = body

    if (!dispatchId || !status) {
      return new Response(JSON.stringify({ success: false, error: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Update dispatch
    const dispatch = await prisma.dispatch.update({
      where: { id: dispatchId },
      data: {
        status,
        ...(arrivedAt && { arrivedAt: new Date(arrivedAt) }),
        ...(completedAt && { completedAt: new Date(completedAt) }),
        ...(notes && { notes }),
      },
    })

    console.log('✓ Dispatch updated:', dispatch.id, status)

    return new Response(
      JSON.stringify({
        success: true,
        data: dispatch,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Update dispatch error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to update dispatch' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

function getETAForTeamType(teamType: string): string {
  switch (teamType) {
    case 'medical':
      return '2 min'
    case 'security':
      return '3 min'
    case 'fire':
      return '2 min'
    default:
      return '5 min'
  }
}
