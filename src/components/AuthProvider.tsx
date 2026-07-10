'use client'

import { useEffect } from 'react'
import { useAuth, initAuth } from '@/hooks/useAuth'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Restore auth from localStorage on mount
    initAuth()
  }, [])

  return <>{children}</>
}
