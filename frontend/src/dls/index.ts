// =============================================================================
// DLS barrel export
// =============================================================================
// Import all DLS components from '@/dls' rather than individual files.
// Each export is added here as its component is implemented.
//
// PRIMITIVES (atoms — no DLS dependencies)
//   Button       — interactive element, 4 variants × 3 sizes
//   Spinner      — loading indicator, 3 sizes
//   ProgressBar  — horizontal fill bar, 4 color variants × 3 height sizes
//   Badge        — category/status pill label with optional icon
//   Avatar       — circular user photo or initial fallback, 5 sizes
//   Skeleton     — single animate-pulse block for building loading layouts
//   Input        — text/number/email input with label, error, and hint slots
//   IconButton   — icon-only button, 3 variants × 3 sizes × 2 shapes
//
// COMPOSITES (molecules — may use DLS primitives internally)
//   AvatarStack  — overlapping row of Avatars with overflow count
//   Card         — surface container with elevation/variant/interactive options
//   EmptyState   — icon + title + description + optional CTA layout
//   Modal        — backdrop + slide-up panel shell with header/footer slots
//   Drawer       — slide-in edge panel with backdrop (left / right / bottom)
//   Tabs         — horizontal tab switcher bar, underline and pill variants
//
// IMPLEMENTATION ORDER (suggested — each primitive before its dependents)
//   1. Spinner      — no deps
//   2. Button       — self-contained spinner SVG (no Spinner import)
//   3. IconButton   — no deps
//   4. ProgressBar  — no deps
//   5. Skeleton     — no deps
//   6. Input        — no deps
//   7. Badge        — no deps (contains icon SVGs)
//   8. Avatar       — no deps
//   9. AvatarStack  — depends on Avatar
//  10. Card         — no deps
//  11. EmptyState   — no deps (callers pass Button as action prop)
//  12. Tabs         — no deps
//  13. Modal        — no deps (uses native DOM for focus trap)
//  14. Drawer       — no deps
// =============================================================================

// export * from './Button';
// export * from './Spinner';
// export * from './ProgressBar';
// export * from './Badge';
// export * from './Avatar';
// export * from './AvatarStack';
// export * from './Skeleton';
// export * from './Input';
// export * from './IconButton';
// export * from './Card';
// export * from './EmptyState';
// export * from './Tabs';
// export * from './Modal';
// export * from './Drawer';
