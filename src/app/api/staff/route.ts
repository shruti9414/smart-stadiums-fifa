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

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req)
  if (!admin) {
    return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const staff = await prisma.user.findMany({
      where: { role: 'staff' },
      select: {
        id: true,
        email: true,
        fullName: true,
        department: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return new Response(
      JSON.stringify({
        success: true,
        data: staff,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error fetching staff:', error)
    return new Response(JSON.stringify({ success: false, error: 'Failed to fetch staff' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

export async function POST(req: NextRequest) {
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

  if (!body.email || !body.password || !body.fullName) {
    return new Response(
      JSON.stringify({ success: false, error: 'Email, password, and fullName required' }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }

  try {
    // Check if email already exists
    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    })

    if (existing) {
      return new Response(JSON.stringify({ success: false, error: 'Email already exists' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(body.password, 12)

    // Validate department
    const validDepartments = ['medical', 'security', 'fire', 'general']
    const department = validDepartments.includes(body.department) ? body.department : 'general'

    // Create staff member in database
    const newStaff = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        fullName: body.fullName,
        role: 'staff',
        department,
      },
    })

    console.log('✓ Staff created in database:', newStaff.email)

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          id: newStaff.id,
          email: newStaff.email,
          fullName: newStaff.fullName,
          role: newStaff.role,
          department: newStaff.department,
          createdAt: newStaff.createdAt,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Staff creation error:', err)
    return new Response(JSON.stringify({ success: false, error: 'Failed to create staff' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
