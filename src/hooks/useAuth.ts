import { create } from 'zustand'

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

export const useAuth = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,
  setAuth: (user, token) => {
    if (token) {
      localStorage.setItem('auth_token', token)
      localStorage.setItem('auth_user', JSON.stringify(user))
    }
    set({ user, token })
  },
  logout: () => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    set({ user: null, token: null })
  },
}))

export function initAuth() {
  const token = localStorage.getItem('auth_token')
  const userStr = localStorage.getItem('auth_user')

  if (token && userStr) {
    try {
      const user = JSON.parse(userStr)
      useAuth.setState({ token, user })
    } catch (e) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    }
  }
}
