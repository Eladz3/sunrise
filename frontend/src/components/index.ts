/**
 * Central export point for shared components
 * Import components like: import { Button, Header } from '@/components'
 */

// UI Components — sourced from the DLS
export { Button, Spinner } from '@/dls'
export { Icon, registerIcon, registerIcons } from './ui/Icon'
export type { IconName, IconProps } from './ui/Icon'

// Layout Components
export { Header } from './layout/Header'

// Goal Components
export { GoalCard, GoalCardSkeleton } from './goal/GoalCard'

// Group Components
export { GroupsSidebar, MobileGroupsDrawer } from './groups'
