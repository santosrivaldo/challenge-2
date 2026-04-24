import { useCallback, useEffect, useState } from 'react'
import { createUser, listUsers } from '../services/walletApi'
import type { CreateUserInput, UserListItem } from '../types/wallet'

function useDebouncedValue<T>(value: T, ms: number): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), ms)
    return () => window.clearTimeout(id)
  }, [value, ms])
  return debounced
}

export function useUsers() {
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebouncedValue(searchInput, 300)
  const [users, setUsers] = useState<UserListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await listUsers(
        debouncedSearch.trim() ? debouncedSearch.trim() : undefined,
      )
      setUsers(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    queueMicrotask(() => {
      void refetch()
    })
  }, [refetch])

  const create = useCallback(async (input: CreateUserInput) => {
    const created = await createUser(input)
    await refetch()
    return created
  }, [refetch])

  return {
    searchInput,
    setSearchInput,
    users,
    loading,
    error,
    refetch,
    createUser: create,
  }
}
