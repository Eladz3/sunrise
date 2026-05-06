/**
 * Central export point for shared components
 * Import components like: import { Button, Header } from '@/components'
 */

// UI Components
export { Button } from './ui/Button'
export { Spinner } from './ui/Spinner'
export { Icon, registerIcon, registerIcons } from './ui/Icon'
export type { IconName, IconProps } from './ui/Icon'

// Layout Components
export { Header } from './layout/Header'

// Community Components
export { CommunityProgressBar } from './community/CommunityProgressBar'

// Goal Components
export { GoalCard } from './goal/GoalCard'
export type { GoalCategory } from './goal/GoalCard'

// Form Components
// export { TextInput } from './forms/TextInput';
