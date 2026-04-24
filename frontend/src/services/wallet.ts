import type {
  CreateUserInput,
  PostTransactionInput,
  Transaction,
  TransactionDateRange,
  UpdateUserInput,
  UserDetail,
  UserListItem,
} from '../types/wallet'
import * as mock from '../mocks/wallet'
import { isRemoteWallet } from './http'
import * as remote from './walletRemote'

export async function listUsers(query?: string): Promise<UserListItem[]> {
  return isRemoteWallet() ? remote.listUsers(query) : mock.listUsers(query)
}

export async function createUser(
  input: CreateUserInput,
): Promise<UserListItem> {
  return isRemoteWallet() ? remote.createUser(input) : mock.createUser(input)
}

export async function getUser(userId: string): Promise<UserDetail> {
  return isRemoteWallet() ? remote.getUser(userId) : mock.getUser(userId)
}

export async function updateUser(
  userId: string,
  input: UpdateUserInput,
): Promise<UserListItem> {
  return isRemoteWallet()
    ? remote.updateUser(userId, input)
    : mock.updateUser(userId, input)
}

export async function postTransaction(
  userId: string,
  input: PostTransactionInput,
): Promise<{ balance: string }> {
  return isRemoteWallet()
    ? remote.postTransaction(userId, input)
    : mock.postTransaction(userId, input)
}

export async function listTransactions(
  userId: string,
  range?: TransactionDateRange,
): Promise<Transaction[]> {
  return isRemoteWallet()
    ? remote.listTransactions(userId, range)
    : mock.listTransactions(userId, range)
}
