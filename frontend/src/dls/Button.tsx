// =============================================================================
// DLS: Button
// =============================================================================
// The primary interactive element. Formalizes the existing Button in
// components/ui/Button.tsx — that file will be replaced by a re-export of
// this one once implemented.
//
// VARIANTS
//   primary   — gradient sunrise-500→dawn-500 fill, white text (default)
//   secondary — warmGray-600 fill, white text
//   outline   — sunrise border + text, transparent background
//   ghost     — no border/background, warmGray text; hover reveals sunrise-50 bg
//
// SIZES
//   sm — px-3 py-1.5 text-sm
//   md — px-4 py-2 text-base (default)
//   lg — px-6 py-3 text-lg
//
// STATES
//   loading  — replaces children with inline spinner + "Loading…" text;
//              also sets disabled to prevent double-submit
//   disabled — reduced opacity (50%), not-allowed cursor
//
// PROPS
//   variant?  : 'primary' | 'secondary' | 'outline' | 'ghost'  (default: 'primary')
//   size?     : 'sm' | 'md' | 'lg'                             (default: 'md')
//   loading?  : boolean                                         (default: false)
//   children  : ReactNode
//   ...rest   : all native HTMLButtonElement attributes (onClick, type, form, etc.)
//
// NOTES
//   - className prop is merged last so callers can override spacing/width without
//     fighting specificity (e.g. "w-full" on a full-width submit button)
//   - The loading spinner SVG is self-contained; do not import the DLS Spinner here
//     to avoid a circular dependency if Spinner ever uses Button internally
//   - focus:ring uses focus:ring-2 + focus:ring-offset-2 for all variants;
//     ring color tracks the variant's primary hue (sunrise-500 for primary/outline/ghost,
//     warmGray-500 for secondary)
//
// USAGE (replaces)
//   components/ui/Button.tsx — identical API, just moves to DLS
//
// CONSUMERS (20+ usages across)
//   pages/Home.tsx, pages/Login.tsx, pages/ProfilePage.tsx
//   components/layout/Header.tsx
//   components/goal/GoalFormModal.tsx, ProgressUpdateModal.tsx
//   components/groups/GroupsSidebar.tsx, CreateGroupModal.tsx,
//     GroupActionModal.tsx, DeleteGroupModal.tsx, InviteModal.tsx,
//     GroupsEmptyState.tsx
// =============================================================================
