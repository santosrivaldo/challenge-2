import { useCallback, useEffect, useState } from 'react'
import { getUser } from '../services/wallet'
import type { UserDetail } from '../types/wallet'

export function useUser(userId: string | undefined) {
  const [user, setUser] = useState<UserDetail | null>(null)
  const [loading, setLoading] = useState(Boolean(userId))
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!userId) {
      setUser(null)
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const data = await getUser(userId)
      setUser(data)
    } catch (e) {
      setUser(null)
      setError(e instanceof Error ? e.message : 'Failed to load user')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    queueMicrotask(() => {
      void refetch()
    })
  }, [refetch])

  return { user, loading, error, refetch }
}
