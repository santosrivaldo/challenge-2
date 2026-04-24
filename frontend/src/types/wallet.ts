export type UserId = string

export type TransactionKind = 'credit' | 'debit'

export type Transaction = {
  id: string
  kind: TransactionKind
  amount: string
  occurredAt: string
}

export type UserListItem = {
  id: UserId
  name: string
  email: string
  balance: string
}

export type UserDetail = UserListItem & {
  transactions: Transaction[]
}

export type CreateUserInput = {
  name: string
  email: string
}

export type PostTransactionInput = {
  kind: TransactionKind
  amount: string
}
