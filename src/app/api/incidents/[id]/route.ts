import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'

async function verifyAuth(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return null
  return await verifyToken(token)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const auth = await verifyAuth(req)
    if (!auth) {
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const { id } = await params
    const body = await req.json()
    const { status } = body

    if (!status) {
      return new Response(JSON.stringify({ success: false, error: 'Status is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Update incident status in database
    const incident = await prisma.incident.update({
      where: { id },
      data: { status },
    })

    console.log('✓ Incident updated:', id, '→', status)

    return new Response(
      JSON.stringify({
        success: true,
        data: incident,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Update incident error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to update incident' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
