import { NextResponse } from 'next/server'
import { ZodSchema } from 'zod'
import { getTokenFromRequest, verifyToken } from './auth'
import { prisma } from './db'

export function success<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status })
}

export function error(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status })
}

export async function validateBody<T>(req: Request, schema: ZodSchema): Promise<T | null> {
  try {
    const body = await req.json()
    return schema.parse(body)
  } catch (err) {
    return null
  }
}

export async function authenticate(req: Request) {
  const token = getTokenFromRequest(req)
  if (!token) return null

  const payload = await verifyToken(token)
  if (!payload || typeof payload.userId !== 'string') return null

  return prisma.user.findUnique({ where: { id: payload.userId } })
}

export async function authorize(req: Request, roles: string[]) {
  const user = await authenticate(req)
  if (!user || !roles.includes(user.role)) return null
  return user
}

export function headers() {
  return {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
  }
}
