// =============================================================================
// DLS: ProgressBar
// =============================================================================
// Horizontal progress bar with a filled track. Currently duplicated inline
// across 5+ locations; this component unifies them.
//
// VARIANTS
//   gradient  — sunrise-400→dawn-500 gradient fill (default; matches brand)
//   amber     — solid amber-400 fill (used for completed goals in GoalCard)
//   emerald   — solid emerald-500 fill (available for positive/health metrics)
//   muted     — warmGray-400 fill (secondary/disabled contexts)
//
// SIZES
//   sm — h-1   (thin accent bar, e.g. bottom edge of GroupCard)
//   md — h-2   (default; GoalCard, UserProgressCard)
//   lg — h-3   (page-level banners in MyGoalsPage header, HomePage metrics)
//
// PROPS
//   value      : number   — current progress value (0–target)
//   max?       : number   — target value (default: 100; pass actual targetValue
//                           when not pre-normalized)
//   variant?   : 'gradient' | 'amber' | 'emerald' | 'muted'  (default: 'gradient')
//   size?      : 'sm' | 'md' | 'lg'                          (default: 'md')
//   className? : string   — merged on the track container
//
// BEHAVIOR
//   - Clamps value to [0, max] before computing width percentage
//   - Uses transition-all duration-300 for animated fill changes
//   - track background: slate-100 normally, amber-100 when variant='amber'
//     (so the amber bar on a completed goal still has contrast)
//
// ACCESSIBILITY
//   - Renders as a <div role="progressbar"> with aria-valuenow, aria-valuemin=0,
//     aria-valuemax on the track element
//
// USAGE (replaces these inline implementations)
//   components/goal/GoalCard.tsx         — progress bar inside GoalCardBody
//   components/groups/GroupCard.tsx      — bottom-edge progress bar (size sm)
//   components/groups/UserProgressCard.tsx — member progress bar (size md)
//   pages/MyGoalsPage.tsx                — header banner overall progress (size lg)
//   pages/HomePage.tsx                   — group metrics banner (size lg)
//
// NOTES
//   - Do NOT add a label or percentage text inside this component; callers
//     render those separately so layout stays flexible
// =============================================================================
