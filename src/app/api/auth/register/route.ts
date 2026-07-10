import { NextRequest } from 'next/server'
import { prisma } from '@/lib/db'
import { generateToken } from '@/lib/auth'
import bcryptjs from 'bcryptjs'

export async function POST(req: NextRequest) {
  try {
    let body: any
    try {
      body = await req.json()
    } catch (e) {
      return new Response(
        JSON.stringify({ success: false, error: 'Invalid JSON' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
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

    if (body.password.length < 6) {
      return new Response(
        JSON.stringify({ success: false, error: 'Password must be at least 6 characters' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Check if email already exists in database
    const existing = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() },
    })

    if (existing) {
      return new Response(
        JSON.stringify({ success: false, error: 'Email already exists' }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // Hash password
    const passwordHash = await bcryptjs.hash(body.password, 12)

    // Create visitor in database
    const newUser = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash,
        fullName: body.fullName,
        role: 'visitor',
      },
    })

    console.log('✓ Visitor registered in database:', newUser.email)

    const token = await generateToken({ userId: newUser.id, role: newUser.role })

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            fullName: newUser.fullName,
            role: newUser.role,
          },
          token,
        },
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (err) {
    console.error('Registration error:', err)
    return new Response(
      JSON.stringify({ success: false, error: 'Registration failed' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
