// =============================================================================
// DLS: IconButton
// =============================================================================
// Square/circular button containing only an icon (no text label). The pattern
// appears in ~8 places across the codebase with inconsistent sizing, padding,
// and hover styles. This component standardizes it.
//
// VARIANTS
//   ghost   — no background, icon color warmGray-500; hover: text-slate-700 + bg-slate-100 (default)
//   outline — border border-slate-200; hover: bg-slate-50
//   danger  — icon color red-500; hover: text-red-700 + bg-red-50
//             (used for destructive actions like the delete button in popovers)
//
// SIZES
//   sm — h-7 w-7   p-1    (triple-dot buttons in GroupCard)
//   md — h-9 w-9   p-2    (default; edit pencil in GoalCard, close X in modals)
//   lg — h-10 w-10 p-2.5  (hamburger menu in HomePage mobile header)
//
// SHAPE
//   square  — rounded-lg (default)
//   circle  — rounded-full (triple-dot menu button, avatar-adjacent controls)
//
// PROPS
//   icon       : ReactNode           — the SVG icon to render
//   label      : string              — aria-label for accessibility (required)
//   variant?   : 'ghost' | 'outline' | 'danger'  (default: 'ghost')
//   size?      : 'sm' | 'md' | 'lg'              (default: 'md')
//   shape?     : 'square' | 'circle'             (default: 'square')
//   className? : string
//   ...rest    : all native HTMLButtonElement attributes (onClick, disabled, type, etc.)
//
// NOTES
//   - aria-label is required (not optional) because icon-only buttons have no
//     visible text; the linter/TS type will enforce this
//   - disabled: opacity-50 cursor-not-allowed (same as Button)
//   - focus:ring-2 focus:ring-offset-1 focus:ring-sunrise-500 on all variants
//
// USAGE (replaces inline <button> elements in)
//   components/groups/GroupCard.tsx        — triple-dot options button (sm, circle, ghost)
//   components/goal/GoalCard.tsx           — edit pencil button (md, square, ghost)
//   components/goal/GoalCard.tsx           — log progress button (different — that
//                                            one has a text label; use Button instead)
//   All modal close buttons                — X icon top-right of modal header (md, square, ghost)
//   pages/HomePage.tsx                     — hamburger menu button (lg, square, ghost)
//   components/groups/InviteModal.tsx      — copy-to-clipboard button (md, square, ghost)
// =============================================================================
