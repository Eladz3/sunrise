// =============================================================================
// DLS: EmptyState
// =============================================================================
// Centered placeholder for zero-data views. The pattern (icon → heading →
// description → optional CTA) appears in both GroupsEmptyState and
// MyGoalsPage's empty goals view, with slightly different implementations.
//
// PROPS
//   icon?        : ReactNode   — SVG or emoji rendered large above the heading;
//                                if omitted, no icon slot is shown
//   title        : string      — primary heading (font-semibold text-slate-700)
//   description? : string      — secondary line below heading (text-sm text-slate-500)
//   action?      : ReactNode   — CTA slot; typically a Button but can be any element
//                                (rendered below description with mt-4 spacing)
//   className?   : string      — merged on the outer container
//
// LAYOUT
//   - Outer container: flex flex-col items-center justify-center text-center
//     gap-3 py-12 px-6
//   - Icon wrapper: w-16 h-16 rounded-2xl bg-gradient-to-br from-sunrise-100
//     to-dawn-100 flex items-center justify-center text-sunrise-500
//     (provides a soft branded background for the icon)
//   - Title: text-base font-semibold text-slate-700
//   - Description: text-sm text-slate-500
//
// USAGE (replaces or underpins)
//   components/groups/GroupsEmptyState.tsx — "No groups yet" state with two CTAs
//                                            (create + join); that component's
//                                            specific layout wraps this primitive
//   pages/MyGoalsPage.tsx                  — "No goals yet" clickable empty card
//                                            (uses interactive Card + EmptyState)
//
// NOTES
//   - GroupsEmptyState also has an inline join-code input below its buttons;
//     that input is specific to groups logic and stays in GroupsEmptyState.
//     EmptyState just provides the icon/title/description/action chrome.
//   - Keep this component purely presentational — no store access, no hooks
// =============================================================================
