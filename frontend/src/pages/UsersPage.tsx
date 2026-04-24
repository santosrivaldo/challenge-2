import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '../components/Button'
import type { Column } from '../components/DataTable'
import { DataTable } from '../components/DataTable'
import { EmptyState } from '../components/EmptyState'
import { Input } from '../components/Input'
import { Modal } from '../components/Modal'
import { PageHeader } from '../components/PageHeader'
import { Spinner } from '../components/Spinner'
import { useUsers } from '../hooks/useUsers'
import type { UserListItem } from '../types/wallet'

export function UsersPage() {
  const {
    searchInput,
    setSearchInput,
    users,
    loading,
    error,
    createUser,
  } = useUsers()
  const [createOpen, setCreateOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [formError, setFormError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const columns: Column<UserListItem>[] = [
    {
      key: 'name',
      header: 'Name',
      render: (u) => (
        <Link
          to={`/users/${u.id}`}
          className="font-medium text-slate-900 underline-offset-2 hover:underline"
        >
          {u.name}
        </Link>
      ),
    },
    { key: 'email', header: 'Email', render: (u) => u.email },
    {
      key: 'balance',
      header: 'Balance',
      className: 'text-right',
      render: (u) => (
        <span className="tabular-nums">{formatMoney(u.balance)}</span>
      ),
    },
  ]

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      await createUser({ name, email })
      setCreateOpen(false)
      setName('')
      setEmail('')
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not create user')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Users"
        description="Manage wallet holders and balances."
        actions={
          <Button type="button" onClick={() => setCreateOpen(true)}>
            Create User
          </Button>
        }
      />

      <div className="mb-4 max-w-md">
        <Input
          label="Search"
          placeholder="Name or email"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
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
      ) : users.length === 0 ? (
        <EmptyState
          title="No users match your search"
          description="Try another keyword or create a new user."
          action={
            <Button type="button" onClick={() => setCreateOpen(true)}>
              Create User
            </Button>
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          rowKey={(u) => u.id}
          empty={<span>No users yet.</span>}
        />
      )}

      <Modal
        open={createOpen}
        onClose={() => !saving && setCreateOpen(false)}
        title="Create user"
        footer={
          <>
            <Button
              variant="secondary"
              type="button"
              disabled={saving}
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" form="create-user-form" loading={saving}>
              Save
            </Button>
          </>
        }
      >
        <form id="create-user-form" className="space-y-4" onSubmit={handleCreate}>
          <Input
            label="Name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoFocus
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {formError && (
            <p className="text-sm text-red-600" role="alert">
              {formError}
            </p>
          )}
        </form>
      </Modal>

      <p className="mt-8 text-xs text-slate-500">
        Tip: balances use mock data. Credit / debit flows are on the user detail
        page.
      </p>
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
