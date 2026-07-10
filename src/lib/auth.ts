import { SignJWT, jwtVerify } from 'jose'
import bcryptjs from 'bcryptjs'

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev-secret-key-change-in-prod')

export async function hashPassword(password: string) {
  return bcryptjs.hash(password, 12)
}

export async function verifyPassword(password: string, hash: string) {
  return bcryptjs.compare(password, hash)
}

export async function generateToken(payload: Record<string, unknown>, expiresIn = '7d') {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresIn)
    .sign(secret)
}

export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload
  } catch {
    return null
  }
}

export function getTokenFromRequest(req: Request) {
  const auth = req.headers.get('authorization')
  return auth?.replace('Bearer ', '') || null
}
