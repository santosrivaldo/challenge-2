import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import type { TransactionKind } from '../types/wallet'
import { postTransaction } from '../services/walletApi'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'

type TransactionModalProps = {
  open: boolean
  userId: string
  defaultKind: TransactionKind
  onClose: () => void
  onCompleted: (balance: string) => void
}

export function TransactionModal({
  open,
  userId,
  defaultKind,
  onClose,
  onCompleted,
}: TransactionModalProps) {
  const [kind, setKind] = useState<TransactionKind>(defaultKind)
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    setKind(defaultKind)
    setAmount('')
    setFormError(null)
  }, [open, defaultKind])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSubmitting(true)
    try {
      const { balance } = await postTransaction(userId, { kind, amount })
      toast.success(`Transaction saved. New balance: ${balance}`)
      onCompleted(balance)
      onClose()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Transaction failed'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !submitting && onClose()}
      title={kind === 'credit' ? 'Credit wallet' : 'Debit wallet'}
      footer={
        <>
          <Button
            variant="secondary"
            type="button"
            disabled={submitting}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" form="txn-form" loading={submitting}>
            Confirm
          </Button>
        </>
      }
    >
      <form id="txn-form" className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="txn-kind"
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            Type
          </label>
          <select
            id="txn-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as TransactionKind)}
            className="block w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm transition focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
          >
            <option value="credit">Credit</option>
            <option value="debit">Debit</option>
          </select>
        </div>
        <Input
          label="Amount"
          name="amount"
          inputMode="decimal"
          placeholder="10.50"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        {formError && (
          <p className="text-sm text-red-600" role="alert">
            {formError}
          </p>
        )}
      </form>
    </Modal>
  )
}
