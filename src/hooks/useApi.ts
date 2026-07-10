import { useState } from 'react'
import { useAuth } from './useAuth'

interface ApiState<T> {
  data: T | null
  error: string | null
  loading: boolean
}

export function useApi<T>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    loading: false,
  })
  const { token } = useAuth()

  const call = async (endpoint: string, options: RequestInit = {}) => {
    setState({ data: null, error: null, loading: true })
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      }

      const res = await fetch(endpoint, { ...options, headers })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Request failed')
      }

      const result = await res.json()
      setState({ data: result.data, error: null, loading: false })
      return result.data as T
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      setState({ data: null, error: message, loading: false })
      return null
    }
  }

  return { ...state, call }
}
