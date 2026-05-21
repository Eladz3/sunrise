// =============================================================================
// DLS: Input
// =============================================================================
// Text input field with consistent baseline styling and support for labels,
// helper text, and error states. Currently all form inputs across 4+ modals
// use raw <input> or <textarea> with ad-hoc Tailwind classes.
//
// VARIANTS
//   default — white bg, slate-300 border, focus:ring-sunrise-500
//   error   — red-300 border, red-50 bg tint, focus:ring-red-500
//             (automatically applied when the `error` prop is set)
//
// TYPES COVERED
//   Input     — wraps <input type="text | number | email | password | url">
//   Textarea  — wraps <textarea> with identical styling; exported as Input.Textarea
//               or as a separate named export TextareaInput (decide at implementation)
//
// PROPS (Input)
//   label?        : string    — rendered as <label> above the input; tied via htmlFor/id
//   placeholder?  : string
//   error?        : string    — if set, renders below the field in red-600 text-sm;
//                               also triggers the error variant styling
//   hint?         : string    — helper text below the field in slate-500 text-sm
//                               (mutually exclusive with error — error takes priority)
//   className?    : string    — merged on the <input> element
//   wrapperClass? : string    — merged on the outer <div> wrapper
//   ...rest       : all native HTMLInputElement attributes (value, onChange, onBlur,
//                   disabled, maxLength, autoFocus, etc.)
//
// ADDITIONAL PROPS (Textarea only)
//   rows?         : number    (default: 3)
//   resize?       : 'none' | 'vertical' | 'both'  (default: 'vertical')
//
// BASE STYLES
//   w-full rounded-lg border px-3 py-2 text-sm text-slate-800
//   placeholder:text-slate-400
//   focus:outline-none focus:ring-2 focus:ring-offset-0
//   disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50
//
// USAGE (replaces inline inputs in)
//   components/goal/GoalFormModal.tsx      — title, description (textarea), unit fields
//   components/groups/CreateGroupModal.tsx — group name field
//   components/groups/GroupActionModal.tsx — join-link field
//   components/groups/GroupsSidebar.tsx    — inline join-code input
//   components/groups/InviteModal.tsx      — read-only invite URL display field
//
// NOTES
//   - The <select> element (GoalFormModal category dropdown, GoalFormModal target value)
//     is a separate Select DLS component candidate but is lower priority given only
//     one form uses it currently; for now GoalFormModal can keep its raw <select>
//   - Number input in ProgressUpdateModal has special stepper buttons — keep that
//     component's custom input logic; it should not use this generic Input
// =============================================================================
