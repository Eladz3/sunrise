// =============================================================================
// DLS: Tabs
// =============================================================================
// Horizontal tab switcher with an active indicator. Currently used in
// HomePage for the Members/Goals content switcher; BottomTabNav is a
// related but distinct component (icon-based navigation, not content tabs)
// and stays separate.
//
// VARIANTS
//   underline — active tab has a bottom border in sunrise-500, text is sunrise-700;
//               inactive is warmGray-500 (default; matches HomePage's tab switcher)
//   pill      — active tab has bg-white rounded-lg shadow-sm;
//               container has bg-warmGray-100 rounded-xl p-1
//               (useful for toggle-style pickers like a future date range selector)
//
// PROPS
//   tabs       : Array<{ key: string; label: string; icon?: ReactNode }>
//                — the tab definitions; key is the value passed to onChange
//   activeTab  : string    — controlled; the key of the currently active tab
//   onChange   : (key: string) => void
//   variant?   : 'underline' | 'pill'  (default: 'underline')
//   className? : string    — merged on the tab bar container
//
// BEHAVIOR
//   - Renders a row of tab buttons; clicking calls onChange(key)
//   - Icons (if provided) are rendered to the left of the label
//   - The active tab gets aria-selected="true"; the container gets role="tablist"
//   - Does NOT render the tab panel content — that's the caller's responsibility;
//     this component is purely the switcher bar
//
// LAYOUT
//   underline variant:
//     Container: flex border-b border-slate-200
//     Tab button: px-4 py-2 text-sm font-medium transition-colors
//                 -mb-px (pulls bottom border into position)
//     Active:     border-b-2 border-sunrise-500 text-sunrise-700
//     Inactive:   text-warmGray-500 hover:text-slate-700
//
//   pill variant:
//     Container: flex bg-warmGray-100 rounded-xl p-1 gap-1
//     Tab button: flex-1 px-3 py-1.5 text-sm font-medium rounded-lg
//                 transition-colors
//     Active:     bg-white shadow-sm text-slate-800
//     Inactive:   text-warmGray-500 hover:text-slate-700
//
// USAGE (replaces)
//   pages/HomePage.tsx — the "Members / Goals" two-tab switcher above the content grid
//
// NOTES
//   - BottomTabNav (components/layout/BottomTabNav.tsx) is NOT replaced by this.
//     BottomTabNav is a navigation element tied to routing; Tabs is a content
//     switcher within a page. They share visual DNA but serve different purposes.
//   - If a future page needs a three-tab switcher or adds icons to the home tabs,
//     this component handles it without changes at the call site.
// =============================================================================
