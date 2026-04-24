import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Badge } from '../components/Badge'
import { Button } from '../components/Button'
import type { Column } from '../components/DataTable'
import { DataTable } from '../components/DataTable'
import { DateRangeFilter, type DateRange } from '../components/DateRangeFilter'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { useTransactions } from '../hooks/useTransactions'
import type { Transaction } from '../types/wallet'

const emptyRange: DateRange = { from: '', to: '' }

export function TransactionsPage() {
  const { id } = useParams<{ id: string }>()
  const [range, setRange] = useState<DateRange>(emptyRange)
  const apiRange = useMemo(
    () => ({ from: range.from || undefined, to: range.to || undefined }),
    [range.from, range.to],
  )
  const { rows, loading, error } = useTransactions(id, apiRange)

  const columns: Column<Transaction>[] = [
    {
      key: 'at',
      header: 'Date',
      render: (t) => (
        <time dateTime={t.occurredAt}>
          {new Intl.DateTimeFormat(undefined, {
            dateStyle: 'medium',
            timeStyle: 'short',
          }).format(new Date(t.occurredAt))}
        </time>
      ),
    },
    {
      key: 'kind',
      header: 'Type',
      render: (t) => (
        <Badge variant={t.kind === 'credit' ? 'credit' : 'debit'}>
          {t.kind === 'credit' ? 'Credit' : 'Debit'}
        </Badge>
      ),
    },
    {
      key: 'amount',
      header: 'Amount',
      className: 'text-right',
      render: (t) => (
        <span
          className={
            t.kind === 'credit'
              ? 'font-medium tabular-nums text-emerald-700'
              : 'font-medium tabular-nums text-red-700'
          }
        >
          {t.kind === 'credit' ? '+' : '-'}
          {formatMoney(t.amount)}
        </span>
      ),
    },
  ]

  if (!id) {
    return <p className="text-sm text-slate-600">Missing user id.</p>
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        description="Filter by occurred date (UTC day boundaries)."
        actions={
          <Button variant="secondary" to={`/users/${id}`}>
            Back to user
          </Button>
        }
      />

      <div className="mb-6 max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <DateRangeFilter value={range} onChange={setRange} />
        <p className="mt-3 text-xs text-slate-500">
          Leave dates empty to show the full history for this user.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : (
        <DataTable columns={columns} data={rows} rowKey={(t) => t.id} />
      )}
    </div>
  )
}

function formatMoney(amount: string) {
  const n = Number(amount)
  if (Number.isNaN(n)) return amount
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(n)
}
