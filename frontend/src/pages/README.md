# Pages

Top-level route components and page-specific code.

## What belongs here:
- **Route components** - Components that map to routes
- **Page-specific components** - Components only used on one page
- **Page-specific logic** - Hooks or utils only used on one page

## Organization:
```
pages/
├── Home.tsx              # Simple pages (single file)
├── Login.tsx
├── Dashboard/            # Complex pages (folder)
│   ├── Dashboard.tsx     # Main page component
│   ├── components/       # Page-specific components
│   └── hooks/            # Page-specific hooks
└── index.ts              # Export all pages
```

## Examples:
- `Home.tsx` - Homepage component
- `Login.tsx` - Login page
- `Dashboard/Dashboard.tsx` - Dashboard page
- `Dashboard/components/StatsCard.tsx` - Component only used in Dashboard
- `Events/EventDetail.tsx` - Event detail page

## Note:
- Each page component corresponds to a route
- Co-locate page-specific code to keep pages self-contained
- Move components to `/components` only when reused across pages
