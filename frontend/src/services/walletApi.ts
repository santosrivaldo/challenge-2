import type {
  CreateUserInput,
  PostTransactionInput,
  Transaction,
  TransactionDateRange,
  UserDetail,
  UserListItem,
} from '../types/wallet'

const MOCK_LATENCY_MS = 280

function delay(ms = MOCK_LATENCY_MS) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function toListItem(u: InternalUser): UserListItem {
  const { id, name, email, balance } = u
  return { id, name, email, balance }
}

function toDetail(u: InternalUser): UserDetail {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    balance: u.balance,
    transactions: u.transactions.map((t) => ({ ...t })),
  }
}

type InternalUser = UserListItem & { transactions: Transaction[] }

let nextUserId = 4
let nextTxnId = 10

let users: InternalUser[] = [
  {
    id: '1',
    name: 'Alice Example',
    email: 'alice@example.com',
    balance: '125.00',
    transactions: [
      {
        id: '1',
        kind: 'credit',
        amount: '150.00',
        occurredAt: '2026-04-20T10:00:00.000Z',
      },
      {
        id: '2',
        kind: 'debit',
        amount: '25.00',
        occurredAt: '2026-04-21T14:30:00.000Z',
      },
    ],
  },
  {
    id: '2',
    name: 'Bob Sample',
    email: 'bob@example.com',
    balance: '48.50',
    transactions: [
      {
        id: '3',
        kind: 'credit',
        amount: '50.00',
        occurredAt: '2026-04-22T09:15:00.000Z',
      },
      {
        id: '4',
        kind: 'debit',
        amount: '1.50',
        occurredAt: '2026-04-23T11:00:00.000Z',
      },
    ],
  },
  {
    id: '3',
    name: 'Carol Demo',
    email: 'carol@demo.test',
    balance: '0.00',
    transactions: [],
  },
]

function normalizeQuery(q: string) {
  return q.trim().toLowerCase()
}

function parsePositiveAmount(raw: string): number {
  const n = Number(String(raw).replace(',', '.').trim())
  if (!Number.isFinite(n) || n <= 0) {
    throw new Error('Amount must be a positive number')
  }
  return Math.round(n * 100) / 100
}

function formatMoney(n: number): string {
  return n.toFixed(2)
}

function findUserIndex(id: string): number {
  return users.findIndex((u) => u.id === id)
}

/**
 * Mock: mirrors future GET users list + search.
 */
export async function listUsers(query?: string): Promise<UserListItem[]> {
  await delay()
  const q = query ? normalizeQuery(query) : ''
  const list = !q
    ? users
    : users.filter(
        (u) =>
          normalizeQuery(u.name).includes(q) ||
          normalizeQuery(u.email).includes(q),
      )
  return list.map(toListItem)
}

/**
 * Mock: create user with zero balance (in-memory only).
 */
export async function createUser(
  input: CreateUserInput,
): Promise<UserListItem> {
  await delay()
  const name = input.name.trim()
  const email = input.email.trim().toLowerCase()
  if (!name) throw new Error('Name is required')
  if (!email) throw new Error('Email is required')
  if (users.some((u) => u.email.toLowerCase() === email)) {
    throw new Error('Email already in use')
  }
  const row: InternalUser = {
    id: String(nextUserId++),
    name,
    email,
    balance: '0.00',
    transactions: [],
  }
  users = [...users, row]
  return toListItem(row)
}

/**
 * Mock: user profile + ledger (aligned with wallet entries shape).
 */
export async function getUser(userId: string): Promise<UserDetail> {
  await delay()
  const idx = findUserIndex(userId)
  if (idx === -1) throw new Error('User not found')
  return toDetail(users[idx])
}

/**
 * Mock: POST wallet transaction; updates balance and appends entry.
 */
export async function postTransaction(
  userId: string,
  input: PostTransactionInput,
): Promise<{ balance: string }> {
  await delay()
  const idx = findUserIndex(userId)
  if (idx === -1) throw new Error('User not found')

  const amountNum = parsePositiveAmount(input.amount)
  const user = users[idx]
  const balanceNum = Number(user.balance)

  if (input.kind === 'debit' && balanceNum + 1e-9 < amountNum) {
    throw new Error('Insufficient balance')
  }

  const delta = input.kind === 'credit' ? amountNum : -amountNum
  const newBalance = formatMoney(balanceNum + delta)

  const entry: Transaction = {
    id: String(nextTxnId++),
    kind: input.kind,
    amount: formatMoney(amountNum),
    occurredAt: new Date().toISOString(),
  }

  const updated: InternalUser = {
    ...user,
    balance: newBalance,
    transactions: [entry, ...user.transactions],
  }

  users = users.map((u, i) => (i === idx ? updated : u))
  return { balance: newBalance }
}

function startOfUtcDay(yyyyMmDd: string): number {
  return new Date(`${yyyyMmDd}T00:00:00.000Z`).getTime()
}

function endOfUtcDay(yyyyMmDd: string): number {
  return new Date(`${yyyyMmDd}T23:59:59.999Z`).getTime()
}

/**
 * Mock: wallet entries for a user with optional date bounds (UTC day edges).
 */
export async function listTransactions(
  userId: string,
  range?: TransactionDateRange,
): Promise<Transaction[]> {
  await delay()
  const idx = findUserIndex(userId)
  if (idx === -1) throw new Error('User not found')

  const fromMs =
    range?.from && range.from.trim() !== ''
      ? startOfUtcDay(range.from.trim())
      : null
  const toMs =
    range?.to && range.to.trim() !== ''
      ? endOfUtcDay(range.to.trim())
      : null

  const list = users[idx].transactions.filter((t) => {
    const tMs = new Date(t.occurredAt).getTime()
    if (fromMs !== null && tMs < fromMs) return false
    if (toMs !== null && tMs > toMs) return false
    return true
  })

  return [...list].sort(
    (a, b) =>
      new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime(),
  )
}

