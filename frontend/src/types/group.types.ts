import type { BaseEntity } from './common.types'

export type Group = BaseEntity & {
  id: number
  name: string
  bannerImage: string
}

export type GroupMemberSummary = {
  userId: number
  displayName: string
  profilePhoto: string
  completionPercentage: number
}

export type GroupSummary = {
  id: number
  name: string
  bannerImage: string
  groupOwnerUserId: number
  aggregateProgress: number
  memberCount: number
  isOwner: boolean
  topMembers: GroupMemberSummary[]
}

export type CreateGroupRequest = {
  name: string
  bannerImage?: string
  groupOwnerUserId: number
}

export type GroupInviteResponse = {
  token: string
}
