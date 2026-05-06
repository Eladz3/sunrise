# Types

TypeScript type definitions and interfaces.

## What belongs here:
- **Domain models** - Core business entities (User, Goal, etc.)
- **API types** - Request/response types for the REST API backend
- **Shared types** - Types used across multiple modules

## Organization:
```
types/
├── index.ts           # Re-export all types
├── models.ts          # Core domain models
├── calendar.ts        # Google Calendar types
└── api.ts             # REST API request/response types
```

## Examples:
```typescript
// models.ts
export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  createdBy: string;
}
```

## Note:
- Use interfaces for object shapes
- Use types for unions, intersections, utilities
- Co-locate page-specific types with pages if only used there
- Prefer explicit types over `any`
