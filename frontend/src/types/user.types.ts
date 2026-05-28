import type { BaseEntity } from './common.types'

export type User = BaseEntity & {
  id: number
  displayName: string
  firstName: string
  lastName: string
  email: string
  profilePhoto: string
  firebaseUid: string
}

export type CreateUserRequest = {
  displayName: string
  firstName: string
  lastName: string
  email: string
  profilePhoto: string
  firebaseUid: string
}
