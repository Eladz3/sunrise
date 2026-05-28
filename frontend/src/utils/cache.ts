import { CACHE_TIMES } from '@/constants/cache.constants'

export function isCacheStale(lastFetched: number | undefined, domain: keyof typeof CACHE_TIMES): boolean {
  if (lastFetched === undefined) return true
  return Date.now() - lastFetched > CACHE_TIMES[domain]
}
