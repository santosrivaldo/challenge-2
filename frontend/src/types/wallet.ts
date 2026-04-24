export type UserId = string

export type UserListItem = {
  id: UserId
  name: string
  email: string
  balance: string
}

export type CreateUserInput = {
  name: string
  email: string
}
