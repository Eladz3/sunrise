export type Tab = 'home' | 'goals' | 'profile'

export type BaseEntity = {
  createdOn: string
  createdBy: number
  modifiedOn?: string | null
  modifiedBy?: number | null
  deletedOn?: string | null
  deletedBy?: number | null
}
