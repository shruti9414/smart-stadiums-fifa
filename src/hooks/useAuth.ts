import { useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  fullName: string
  role: string
  department?: string
}

interface AuthStore {
  user: User | null
  token: string | null
  isLoading: boolean
  setAuth: (user: User | null, token: string | null) => void
  logout: () => void
}

// Simple hook-based auth (replaces Zustand for Vercel compatibility)
export const useAuth = (): Partial<AuthStore> => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedToken = localStorage.getItem('auth_token')
      const savedUser = localStorage.getItem('auth_user')
      if (savedToken) setToken(savedToken)
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser))
        } catch (e) {
          console.error('Failed to parse user:', e)
        }
      }
      setIsLoading(false)
    }
  }, [])

  const setAuth = (newUser: User | null, newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
    setUser(newUser)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setUser(null)
    setToken(null)
  }

  return { user, token, isLoading, setAuth, logout }
}
