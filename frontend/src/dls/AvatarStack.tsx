// =============================================================================
// DLS: AvatarStack
// =============================================================================
// Horizontally overlapping row of Avatar components with an optional overflow
// count badge. Currently implemented inline in GroupCard.
//
// PROPS
//   members    : Array<{ userId: number; displayName: string; profilePhoto?: string | null }>
//   max?       : number  — how many avatars to show before collapsing to "+N"  (default: 4)
//   size?      : 'xs' | 'sm'   — passed through to each Avatar  (default: 'xs')
//   className? : string
//
// BEHAVIOR
//   - Renders up to `max` Avatar elements with -space-x-2 overlap
//   - If members.length > max, appends a "+N" circle using the same size/style
//     as the avatars but with warmGray-200 bg and warmGray-600 text
//   - Each Avatar gets a title={member.displayName} tooltip
//
// NOTES
//   - Uses Avatar from dls/Avatar.tsx — do not inline the photo/initial logic here
//   - The "+N" overflow chip should not be clickable; it's purely informational
//   - z-index stacking: avatars laid out left-to-right, each subsequent avatar
//     has lower z-index so the first avatar appears on top (matches current
//     GroupCard behavior)
//
// USAGE (replaces)
//   components/groups/GroupCard.tsx — the flex -space-x-2 member avatar block
//
// POTENTIAL FUTURE USE
//   Any place that shows "who is in this group/thread/event" — e.g. a future
//   group detail page or notification surfaces
// =============================================================================
