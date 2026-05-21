// =============================================================================
// DLS: Spinner
// =============================================================================
// Inline loading indicator. Formalizes the existing Spinner in
// components/ui/Spinner.tsx — that file will be replaced by a re-export of
// this one once implemented.
//
// SIZES
//   sm — h-4 w-4  (used inline inside buttons)
//   md — h-6 w-6  (default; used for card-level loading)
//   lg — h-8 w-8  (used for page-level loading states in MyGoalsPage)
//
// PROPS
//   size?      : 'sm' | 'md' | 'lg'  (default: 'md')
//   className? : string               (merged onto the SVG element for color overrides)
//
// NOTES
//   - Renders a single SVG circle (stroke, 25% opacity base arc + 75% opacity
//     sweep arc) with animate-spin
//   - Default color is currentColor so it inherits from parent text color;
//     callers can pass className="text-sunrise-500" etc.
//   - aria-hidden="true" on the SVG; callers are responsible for sr-only text
//     if the spinner is the only loading affordance visible
//
// USAGE (replaces)
//   components/ui/Spinner.tsx — identical API, just moves to DLS
//
// CONSUMERS
//   pages/MyGoalsPage.tsx (page-level loading, size lg)
//   dls/Button.tsx        (inline loading state, size sm — but Button has its
//                          own self-contained SVG; Spinner is for standalone use)
// =============================================================================
