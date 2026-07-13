import '@testing-library/jest-dom'

// Mock environment variables
process.env.GOOGLE_AI_API_KEY = 'test-key'
process.env.AUTH_SECRET = 'test-secret'
process.env.DATABASE_URL = 'mysql://test:test@localhost:3306/smart_stadiums_test'
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:3000'
