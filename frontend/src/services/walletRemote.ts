import type {
  CreateUserInput,
  PostTransactionInput,
  Transaction,
  TransactionDateRange,
  TransactionKind,
  UpdateUserInput,
  UserDetail,
  UserListItem,
} from '../types/wallet'
import { jsonFetch } from './http'

type RemoteUserRow = {
  id: number
  name: string
  email: string
  balance: string
}

type RemoteEntry = {
  id: number
  kind: string
  amount: string
  occurred_at: string
}

function toUserId(id: number): string {
  return String(id)
}

function normalizeUser(row: RemoteUserRow): UserListItem {
  return {
    id: toUserId(row.id),
    name: row.name,
    email: row.email,
    balance: row.balance,
  }
}

function entryToTransaction(e: RemoteEntry): Transaction {
  return {
    id: String(e.id),
    kind: e.kind as TransactionKind,
    amount: e.amount,
    occurredAt: e.occurred_at,
  }
}

function dayStartIso(yyyyMmDd: string): string {
  return `${yyyyMmDd.trim()}T00:00:00.000Z`
}

function dayEndIso(yyyyMmDd: string): string {
  return `${yyyyMmDd.trim()}T23:59:59.999Z`
}

export async function listUsers(query?: string): Promise<UserListItem[]> {
  const rows = await jsonFetch<RemoteUserRow[]>(`/users`)
  let list = rows.map(normalizeUser)
  const q = query?.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (u) =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q),
    )
  }
  return list
}

export async function createUser(
  input: CreateUserInput,
): Promise<UserListItem> {
  const row = await jsonFetch<RemoteUserRow>(`/users`, {
    method: 'POST',
    body: JSON.stringify({
      name: input.name.trim(),
      email: input.email.trim(),
    }),
  })
  return normalizeUser(row)
}

export async function getUser(userId: string): Promise<UserDetail> {
  const [profile, entriesPayload] = await Promise.all([
    jsonFetch<RemoteUserRow>(`/users/${encodeURIComponent(userId)}`),
    jsonFetch<{ entries: RemoteEntry[] }>(
      `/users/${encodeURIComponent(userId)}/wallet/entries`,
    ),
  ])
  const base = normalizeUser(profile)
  const transactions = (entriesPayload.entries || []).map(entryToTransaction)
  transactions.sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
  return { ...base, transactions }
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
): Promise<UserListItem> {
  const row = await jsonFetch<RemoteUserRow>(
    `/users/${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim(),
      }),
    },
  )
  return normalizeUser(row)
}

export async function postTransaction(
  userId: string,
  input: PostTransactionInput,
): Promise<{ balance: string }> {
  const body = await jsonFetch<{ user_id: number; balance: string }>(
    `/users/${encodeURIComponent(userId)}/wallet/transactions`,
    {
      method: 'POST',
      body: JSON.stringify({
        kind: input.kind,
        amount: input.amount,
      }),
    },
  )
  return { balance: body.balance }
}

export async function listTransactions(
  userId: string,
  range?: TransactionDateRange,
): Promise<Transaction[]> {
  const params = new URLSearchParams()
  if (range?.from?.trim()) params.set('from', dayStartIso(range.from.trim()))
  if (range?.to?.trim()) params.set('to', dayEndIso(range.to.trim()))
  const qs = params.toString()
  const path =
    `/users/${encodeURIComponent(userId)}/wallet/entries` +
    (qs ? `?${qs}` : '')
  const body = await jsonFetch<{ entries: RemoteEntry[] }>(path)
  return (body.entries || []).map(entryToTransaction)
}
