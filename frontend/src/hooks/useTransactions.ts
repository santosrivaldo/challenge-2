import { useCallback, useEffect, useState } from 'react'
import { listTransactions } from '../mocks/wallet'
import type { Transaction, TransactionDateRange } from '../types/wallet'

export function useTransactions(
  userId: string | undefined,
  range: TransactionDateRange,
) {
  const [rows, setRows] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(Boolean(userId))
  const [error, setError] = useState<string | null>(null)

  const refetch = useCallback(async () => {
    if (!userId) {
      setRows([])
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const payload: TransactionDateRange = {}
      if (range.from?.trim()) payload.from = range.from.trim()
      if (range.to?.trim()) payload.to = range.to.trim()
      const data = await listTransactions(
        userId,
        Object.keys(payload).length ? payload : undefined,
      )
      setRows(data)
    } catch (e) {
      setRows([])
      setError(e instanceof Error ? e.message : 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }, [userId, range.from, range.to])

  useEffect(() => {
    queueMicrotask(() => {
      void refetch()
    })
  }, [refetch])

  return { rows, loading, error, refetch }
}
