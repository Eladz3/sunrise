// =============================================================================
// DLS: Skeleton
// =============================================================================
// Animated placeholder block for loading states. Currently duplicated in
// GoalCardSkeleton and UserProgressCardSkeleton — each assembles their own
// animate-pulse layout by hand. This primitive is a single rectangular block
// that callers compose into full skeleton layouts.
//
// PROPS
//   width?     : string   — Tailwind width class, e.g. "w-full", "w-32", "w-40"
//                           (default: "w-full")
//   height?    : string   — Tailwind height class, e.g. "h-2", "h-4", "h-8"
//                           (default: "h-4")
//   rounded?   : string   — Tailwind rounded class (default: "rounded")
//                           Use "rounded-full" for circle/pill shapes (avatar skeletons)
//   className? : string   — merged on the element (for positioning, margin, etc.)
//
// BEHAVIOR
//   - Renders a <div> with bg-gray-200 animate-pulse and the given size/rounded classes
//   - No internal layout or children — purely a single block
//   - Compose multiple Skeleton blocks to build a full skeleton layout:
//
//     // Example: GoalCardSkeleton rebuilt with DLS primitives
//     <Card>
//       <div className="flex items-start gap-3 mb-4">
//         <Skeleton width="w-8" height="h-8" rounded="rounded-xl" />
//         <div className="flex-1 space-y-2">
//           <Skeleton width="w-40" height="h-4" />
//           <Skeleton width="w-24" height="h-3" />
//         </div>
//       </div>
//       ...
//     </Card>
//
// USAGE (replaces inline animate-pulse blocks in)
//   components/goal/GoalCard.tsx         — GoalCardSkeleton
//   components/groups/UserProgressCard.tsx — UserProgressCardSkeleton
//
// NOTES
//   - The feature-level *Skeleton components (GoalCardSkeleton, UserProgressCardSkeleton)
//     are NOT removed — they stay as named exports from their feature files so
//     call sites don't change. They just rebuild their internals using this primitive.
//   - Do not put animation on child elements separately; wrap a group of Skeleton
//     blocks in a single animate-pulse container to sync the pulse across them.
//     The parent Card or a wrapping <div className="animate-pulse"> handles this.
// =============================================================================
