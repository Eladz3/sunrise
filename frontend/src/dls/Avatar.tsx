// =============================================================================
// DLS: Avatar
// =============================================================================
// Circular user avatar that shows a profile photo or falls back to an
// initial letter on the brand gradient. Currently duplicated in three places
// with identical logic.
//
// SIZES
//   xs  — w-6 h-6   text-[9px]  (stacked avatars in GroupCard AvatarStack)
//   sm  — w-8 h-8   text-xs     (compact list items)
//   md  — w-10 h-10 text-sm     (default; UserProgressCard member list)
//   lg  — w-12 h-12 text-base   (group member detail views)
//   xl  — w-16 h-16 text-xl     (ProfilePage header)
//
// PROPS
//   displayName  : string        — used to derive the fallback initial (charAt(0).toUpperCase())
//   profilePhoto?: string | null — if present, renders an <img>; otherwise shows initial
//   size?        : 'xs' | 'sm' | 'md' | 'lg' | 'xl'  (default: 'md')
//   className?   : string
//
// BEHAVIOR
//   - Photo mode: <img src=… alt=… className="w-full h-full object-cover" />
//   - Fallback mode: brand gradient bg (from-sunrise-400 to-dawn-500) + white initial letter
//   - Both modes: rounded-full overflow-hidden border-2 border-white
//     (border only needed in stacked context; callers can override via className)
//
// ACCESSIBILITY
//   - In photo mode: alt={displayName}
//   - In fallback mode: aria-label={displayName} on the container div
//
// USAGE (replaces these inline implementations)
//   components/groups/GroupCard.tsx       — xs avatars in the AvatarStack row
//   components/groups/UserProgressCard.tsx — md avatar next to member name
//   pages/ProfilePage.tsx                 — xl avatar in profile header
//   components/layout/Header.tsx          — sm avatar in nav (if present)
//
// NOTES
//   - The border-2 border-white is needed for AvatarStack overlap; when used
//     standalone (UserProgressCard, ProfilePage) it's harmless but callers can
//     remove it via className if needed
// =============================================================================
