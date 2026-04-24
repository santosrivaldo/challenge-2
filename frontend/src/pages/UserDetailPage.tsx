import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '../components/Button'
import { Card } from '../components/Card'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { TransactionModal } from '../components/TransactionModal'
import { useUser } from '../hooks/useUser'
import type { TransactionKind } from '../types/wallet'

export function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { user, loading, error, refetch } = useUser(id)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalKind, setModalKind] = useState<TransactionKind>('credit')
  const [modalNonce, setModalNonce] = useState(0)

  function openModal(kind: TransactionKind) {
    setModalKind(kind)
    setModalNonce((n) => n + 1)
    setModalOpen(true)
  }

  if (!id) {
    return <p className="text-sm text-slate-600">Missing user id.</p>
  }

  return (
    <div>
      <PageHeader
        title="User"
        description="Wallet overview and quick operations."
        actions={<Button variant="secondary" to="/">Back to users</Button>}
      />

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner />
        </div>
      ) : user ? (
        <>
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2" title="Profile">
              <dl className="grid gap-4 sm:grid-cols-2">
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Name
                  </dt>
                  <dd className="mt-1 text-sm font-medium text-slate-900">
                    {user.name}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-slate-900">{user.email}</dd>
                </div>
              </dl>
            </Card>

            <Card title="Balance">
              <p className="text-3xl font-semibold tabular-nums tracking-tight text-slate-900">
                {formatMoney(user.balance)}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <Button type="button" onClick={() => openModal('credit')}>
                  Credit
                </Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => openModal('debit')}
                >
                  Debit
                </Button>
              </div>
            </Card>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Button
              variant="secondary"
              to={`/users/${user.id}/transactions`}
            >
              View transactions
            </Button>
          </div>

          <TransactionModal
            key={`${user.id}-${modalNonce}`}
            open={modalOpen}
            userId={user.id}
            defaultKind={modalKind}
            onClose={() => setModalOpen(false)}
            onCompleted={() => {
              void refetch()
            }}
          />
        </>
      ) : null}
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
