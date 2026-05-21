// =============================================================================
// DLS: Card
// =============================================================================
// Base surface container providing consistent elevation, rounding, and
// background. The combination `bg-white rounded-xl shadow-sm` (and its
// hover/complete variants) appears in every card-like component; this
// unifies the foundation while letting feature cards compose on top.
//
// VARIANTS
//   default   — bg-white shadow-sm (base)
//   elevated  — bg-white shadow-md (used for modal panels, dropdowns)
//   muted     — bg-gray-50 shadow-none border border-gray-100 (UserProgressCard bg)
//   complete  — bg-gradient-to-br from-amber-50 to-orange-50 ring-1 ring-amber-200
//               (GoalCard completed state)
//   selected  — bg-sunrise-50 border border-sunrise-400 shadow-sm (GroupCard selected)
//
// INTERACTIVE (optional)
//   When the `interactive` prop is true, adds:
//     hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
//     (matches the current GoalCard hover effect)
//   When `onClick` is provided, renders as <button> (full-width, text-left)
//   instead of <div> so click is accessible — callers should not wrap a Card
//   in a button themselves.
//
// PROPS
//   variant?     : 'default' | 'elevated' | 'muted' | 'complete' | 'selected'
//                  (default: 'default')
//   interactive? : boolean   — adds hover lift/shadow transition  (default: false)
//   onClick?     : () => void — if provided, renders as <button>
//   padding?     : 'none' | 'sm' | 'md' | 'lg'
//                  none — no padding (caller controls all internal spacing)
//                  sm   — p-3
//                  md   — p-5   (default; matches current GoalCard, GroupCard)
//                  lg   — p-6
//   className?   : string
//   children     : ReactNode
//
// USAGE (replaces or underpins)
//   components/goal/GoalCard.tsx        — outer card shell; complete variant for finished goals
//   components/groups/GroupCard.tsx     — outer card shell; selected variant for active group
//   components/groups/UserProgressCard.tsx — muted variant
//   pages/Home.tsx                      — feature cards in landing page grid
//   pages/MyGoalsPage.tsx               — empty state clickable card (interactive + onClick)
//
// NOTES
//   - This is not meant to replace GoalCard or GroupCard themselves — those
//     components keep all their internal layout and logic. Card just provides
//     the outer wrapper, replacing the 3-4 inline class combos those components
//     currently compute themselves.
//   - rounded-xl is the fixed corner radius across all variants; do not add
//     a radius prop — consistency is more valuable than flexibility here.
// =============================================================================
