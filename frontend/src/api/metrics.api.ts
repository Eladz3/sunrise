import { client } from './client'
import type { GoalMetrics } from '@/types'

export const getUserMetrics = (userId: number) => client.get<GoalMetrics>(`/api/metrics/by-user-id/${userId}`)

export const getGroupMetrics = (groupId: number) => client.get<GoalMetrics>(`/api/metrics/by-group-id/${groupId}`)

export const getGlobalMetrics = () => client.get<GoalMetrics>('/api/metrics/global')
