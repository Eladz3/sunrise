// =============================================================================
// DLS: Drawer
// =============================================================================
// Slide-in panel that overlays content from a screen edge (default: left).
// MobileGroupsDrawer currently implements this pattern ad hoc with fixed
// positioning + a backdrop div; this component generalizes it.
//
// SIDES
//   left   — slides in from the left edge  (default; matches MobileGroupsDrawer)
//   right  — slides in from the right edge
//   bottom — slides up from the bottom edge (useful for action sheets on mobile)
//
// PROPS
//   open       : boolean        — controls visibility; drawer is removed from DOM when false
//   onClose    : () => void     — called when backdrop clicked or Escape pressed
//   side?      : 'left' | 'right' | 'bottom'  (default: 'left')
//   width?     : string         — Tailwind width class for left/right drawers
//                                 (default: 'w-72'; matches current MobileGroupsDrawer)
//   height?    : string         — Tailwind height class for bottom drawer
//                                 (default: 'h-auto max-h-[85vh]')
//   children   : ReactNode      — drawer body content
//   className? : string         — merged on the drawer panel
//
// BEHAVIOR
//   - Backdrop: fixed inset-0 bg-black/30 z-40; click calls onClose
//   - Panel: fixed z-50 bg-white shadow-xl; slides in from the chosen side
//   - Animation:
//       left/right — translate-x from ±100% to 0 with transition-transform duration-300
//       bottom     — translate-y from 100% to 0 with transition-transform duration-300
//   - Escape key: keydown listener when open=true
//   - Body scroll lock: adds overflow-hidden to document.body while open
//
// ACCESSIBILITY
//   - role="dialog" aria-modal="true" on the panel
//   - Focus trap while open (same approach as Modal)
//
// USAGE (replaces)
//   components/groups/MobileGroupsDrawer.tsx — left drawer with GroupsSidebar inside;
//     that component becomes a thin wrapper: <Drawer open onClose side="left">
//       <GroupsSidebar compact />
//     </Drawer>
//
// NOTES
//   - No built-in header/close button — the drawer content is responsible for its
//     own layout (GroupsSidebar already has its own header with a close affordance)
//   - The bottom-sheet variant is not currently used but is cheap to support and
//     rounds out the component for future mobile action sheets
// =============================================================================
