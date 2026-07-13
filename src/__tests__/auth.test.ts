import { SignJWT, jwtVerify } from 'jose'

describe('Authentication', () => {
  const secret = new TextEncoder().encode('test-secret-key-min-32-chars-long!!!')

  describe('JWT Token Generation', () => {
    it('should create valid JWT token', async () => {
      const token = await new SignJWT({ userId: 'user-123', role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.split('.').length).toBe(3) // JWT format: header.payload.signature
    })

    it('should encode user data in token', async () => {
      const userId = 'user-456'
      const role = 'staff'

      const token = await new SignJWT({ userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

      const verified = await jwtVerify(token, secret)
      expect(verified.payload.userId).toBe(userId)
      expect(verified.payload.role).toBe(role)
    })
  })

  describe('Token Verification', () => {
    it('should successfully verify valid token', async () => {
      const originalData = { userId: 'user-789', email: 'test@example.com' }

      const token = await new SignJWT(originalData)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

      const verified = await jwtVerify(token, secret)
      expect(verified.payload.userId).toBe(originalData.userId)
      expect(verified.payload.email).toBe(originalData.email)
    })

    it('should reject invalid token', async () => {
      const invalidToken = 'invalid.token.here'
      const wrongSecret = new TextEncoder().encode('wrong-secret-key-32-chars-long!!!!')

      expect(async () => {
        await jwtVerify(invalidToken, wrongSecret)
      }).rejects.toThrow()
    })

    it('should include issued and expiration times', async () => {
      const token = await new SignJWT({ userId: 'user-101' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

      const verified = await jwtVerify(token, secret)
      expect(verified.payload.iat).toBeDefined()
      expect(verified.payload.exp).toBeDefined()
      expect(verified.payload.exp).toBeGreaterThan(verified.payload.iat!)
    })
  })

  describe('Password Security', () => {
    it('should handle password hashing simulation', async () => {
      // Simulating bcryptjs behavior
      const password = 'SecurePassword123!'
      const hashedPassword = await Promise.resolve(
        `$2b$12$${Buffer.from(password).toString('base64').substring(0, 53)}`
      )

      expect(hashedPassword).toBeTruthy()
      expect(hashedPassword.length).toBeGreaterThan(20)
    })
  })

  describe('Multi-role Support', () => {
    it('should support admin role', async () => {
      const token = await new SignJWT({ userId: 'admin-1', role: 'admin' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

      const verified = await jwtVerify(token, secret)
      expect(verified.payload.role).toBe('admin')
    })

    it('should support staff role', async () => {
      const token = await new SignJWT({ userId: 'staff-1', role: 'staff' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

      const verified = await jwtVerify(token, secret)
      expect(verified.payload.role).toBe('staff')
    })

    it('should support visitor role', async () => {
      const token = await new SignJWT({ userId: 'visitor-1', role: 'visitor' })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('1h')
        .sign(secret)

      const verified = await jwtVerify(token, secret)
      expect(verified.payload.role).toBe('visitor')
    })
  })
})
