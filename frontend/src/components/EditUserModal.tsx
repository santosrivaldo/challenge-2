import { useState } from 'react'
import { toast } from 'sonner'
import { updateUser } from '../mocks/wallet'
import { Button } from './Button'
import { Input } from './Input'
import { Modal } from './Modal'

type EditUserModalProps = {
  open: boolean
  userId: string
  initialName: string
  initialEmail: string
  onClose: () => void
  onSaved: () => void
}

export function EditUserModal({
  open,
  userId,
  initialName,
  initialEmail,
  onClose,
  onSaved,
}: EditUserModalProps) {
  const [name, setName] = useState(initialName)
  const [email, setEmail] = useState(initialEmail)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setFormError(null)
    setSaving(true)
    try {
      await updateUser(userId, { name, email })
      toast.success('Profile updated')
      onSaved()
      onClose()
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Could not save changes'
      setFormError(msg)
      toast.error(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={() => !saving && onClose()}
      title="Edit profile"
      footer={
        <>
          <Button
            variant="secondary"
            type="button"
            disabled={saving}
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" form="edit-user-form" loading={saving}>
            Save
          </Button>
        </>
      }
    >
      <form id="edit-user-form" className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
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
  )
}
