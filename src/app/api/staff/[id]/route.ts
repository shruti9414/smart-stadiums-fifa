import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { verifyToken } from '@/lib/auth'
import bcryptjs from 'bcryptjs'

async function verifyAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return null
  }
  const payload = await verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return null
  }
  return payload
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(req)
  if (!admin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body: any
  try {
    body = await req.json()
  } catch (e) {
    return new Response(JSON.stringify({ success: false, error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  if (!body.fullName || !body.email) {
    return new Response(JSON.stringify({ success: false, error: 'Full name and email required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = await params

  try {
    // Check if staff exists
    const staff = await prisma.user.findFirst({
      where: {
        id,
        role: 'staff',
      },
    })

    if (!staff) {
      return new Response(JSON.stringify({ success: false, error: 'Staff member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Prepare update data
    const updateData: any = {
      fullName: body.fullName,
      email: body.email.toLowerCase(),
    }

    // Only hash password if provided
    if (body.password && body.password.trim()) {
      updateData.passwordHash = await bcryptjs.hash(body.password, 12)
    }

    // Update staff member
    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    })

    console.log('✓ Staff updated in database:', updated.email)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: updated.id,
          email: updated.email,
          fullName: updated.fullName,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Staff update error:', error)
    return new Response(JSON.stringify({ success: false, error: 'Failed to update staff' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await verifyAdmin(req)
  if (!admin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { id } = await params

  try {
    // Check if staff exists
    const staff = await prisma.user.findFirst({
      where: {
        id,
        role: 'staff',
      },
    })

    if (!staff) {
      return new Response(JSON.stringify({ success: false, error: 'Staff member not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Delete staff member
    await prisma.user.delete({
      where: { id },
    })

    console.log('✓ Staff deleted from database:', id)

    return new Response(
      JSON.stringify({ success: true, message: 'Staff member deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Staff delete error:', error)
    return new Response(JSON.stringify({ success: false, error: 'Failed to delete staff' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
