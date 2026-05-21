// =============================================================================
// DLS: Badge
// =============================================================================
// Small pill/chip label for categorical or status information. Unifies the
// category badge system in GoalCard and the status badges in DevPanel.
//
// VARIANTS (color semantics)
//   // Goal categories — each maps to a Tailwind color token pair
//   health        — rose-100 bg / rose-700 text / rose-200 border
//   fitness       — orange-100 / orange-700 / orange-200
//   finance       — emerald-100 / emerald-700 / emerald-200
//   learning      — blue-100 / blue-700 / blue-200
//   career        — purple-100 / purple-700 / purple-200
//   relationships — pink-100 / pink-700 / pink-200
//   creativity    — amber-100 / amber-700 / amber-200
//   mindfulness   — cyan-100 / cyan-700 / cyan-200
//   other         — slate-100 / slate-700 / slate-200
//
//   // Semantic status variants (for DevPanel and future use)
//   success  — emerald tones
//   warning  — amber tones
//   danger   — red tones
//   neutral  — warmGray tones
//
// PROPS
//   variant    : GoalCategory | 'success' | 'warning' | 'danger' | 'neutral'
//   icon?      : ReactNode   — rendered before the label (e.g. category SVG icon)
//   children   : ReactNode   — the label text
//   className? : string
//
// NOTES
//   - Base styles: inline-flex items-center gap-1 text-xs px-2 py-0.5
//     rounded-full border font-medium
//   - The GoalCategory icon set (9 SVGs for Health→Other) should be co-located
//     in this file or in a sibling dls/icons/ folder, since they are only ever
//     used inside Badge
//   - DevPanel status badges currently use ad-hoc inline classes; those will be
//     replaced by <Badge variant="success">pass</Badge> etc.
//   - The categoryConfig lookup table from GoalCard.tsx moves here when
//     implemented; GoalCard will import { categoryConfig } from '@/dls/Badge'
//
// CONSUMERS (replaces)
//   components/goal/GoalCard.tsx   — category badges in GoalCardBody (icon + label)
//                                    and the standalone category pill in the footer
//   components/dev/DevPanel.tsx    — idle / running / pass / fail status badges
// =============================================================================
