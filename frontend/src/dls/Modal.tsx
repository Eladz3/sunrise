// =============================================================================
// DLS: Modal
// =============================================================================
// Base modal shell providing backdrop, slide-up animation, scrollable body,
// and optional sticky header/footer slots. All 6 feature modals currently
// re-implement this wrapper; they will each become thin consumers of this shell.
//
// PROPS
//   isOpen     : boolean           — controls visibility; when false the modal
//                                    is not rendered (not just hidden)
//   onClose    : () => void        — called when backdrop clicked or Escape pressed
//   title?     : string            — text rendered in the sticky header; if omitted,
//                                    no header bar is rendered
//   children   : ReactNode         — scrollable body content
//   footer?    : ReactNode         — sticky footer slot (typically action buttons)
//   size?      : 'sm' | 'md' | 'lg'
//                 sm — max-w-sm   (confirm/destructive dialogs: DeleteGroupModal)
//                 md — max-w-md   (default; most feature modals)
//                 lg — max-w-lg   (complex forms with multiple fields)
//   className? : string            — merged on the modal panel (not the backdrop)
//
// BEHAVIOR
//   - Backdrop: fixed inset-0 bg-black/50 backdrop-blur-sm z-50
//   - Panel: centered with flex items-end sm:items-center so on mobile it anchors
//     to bottom; on sm+ it centers vertically
//   - Slide-up animation: uses the existing `slide-up` keyframe from index.css
//     (translate-y from 100% to 0 over 0.3s ease-out)
//   - Escape key: attaches a keydown listener when isOpen=true, calls onClose
//   - Body scroll lock: adds/removes `overflow-hidden` on document.body
//     (mirrors what index.css .modal-open class already does — decide one approach)
//   - Sticky header: flex items-center justify-between p-4 border-b border-slate-100
//     Title text: font-semibold text-slate-800
//     Close button: X icon, ghost style, calls onClose
//   - Sticky footer: p-4 border-t border-slate-100
//
// ACCESSIBILITY
//   - role="dialog" aria-modal="true" aria-labelledby (ties to title element id)
//   - Focus trap: on open, move focus to the first focusable element inside the panel;
//     on close, restore focus to the trigger element
//
// USAGE (replaces the wrapper boilerplate in all of these)
//   components/goal/GoalFormModal.tsx        (size: md)
//   components/goal/ProgressUpdateModal.tsx  (size: sm)
//   components/groups/CreateGroupModal.tsx   (size: sm)
//   components/groups/GroupActionModal.tsx   (size: md)
//   components/groups/DeleteGroupModal.tsx   (size: sm)
//   components/groups/InviteModal.tsx        (size: sm)
//
// NOTES
//   - Each feature modal keeps its own internal form/state logic; Modal only
//     provides the chrome (backdrop, animation, header, footer slots)
//   - Do NOT put form elements or buttons inside Modal itself; keep it a pure shell
// =============================================================================
