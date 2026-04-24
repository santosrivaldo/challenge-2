import type { CreateUserInput, UserListItem } from '../types/wallet'

const MOCK_LATENCY_MS = 280

function delay(ms = MOCK_LATENCY_MS) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

type InternalUser = UserListItem

let users: InternalUser[] = [
  {
    id: '1',
    name: 'Alice Example',
    email: 'alice@example.com',
    balance: '125.00',
  },
  {
    id: '2',
    name: 'Bob Sample',
    email: 'bob@example.com',
    balance: '48.50',
  },
  {
    id: '3',
    name: 'Carol Demo',
    email: 'carol@demo.test',
    balance: '0.00',
  },
]

let nextId = 4

function normalizeQuery(q: string) {
  return q.trim().toLowerCase()
}

/**
 * Mock: mirrors future GET users list + search.
 * Replace implementation with fetch(import.meta.env.VITE_API_BASE_URL + ...).
 */
export async function listUsers(query?: string): Promise<UserListItem[]> {
  await delay()
  const q = query ? normalizeQuery(query) : ''
  if (!q) return users.map((u) => ({ ...u }))
  return users
    .filter(
      (u) =>
        normalizeQuery(u.name).includes(q) ||
        normalizeQuery(u.email).includes(q),
    )
    .map((u) => ({ ...u }))
}

/**
 * Mock: create user with zero balance (not in API doc; in-memory only).
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
    id: String(nextId++),
    name,
    email,
    balance: '0.00',
  }
  users = [...users, row]
  return { ...row }
}
