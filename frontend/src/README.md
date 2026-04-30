# Source Code Structure

This document provides an overview of the application's folder structure and architectural decisions.

## 📁 Folder Structure

```
src/
├── auth/              # Authentication logic and providers
├── components/        # Reusable UI components
│   ├── ui/           # Basic primitives (Button, Card, Input)
│   ├── layout/       # Layout components (Header, Footer)
│   └── forms/        # Form components
├── config/           # App configuration and initialization
├── hooks/            # Custom React hooks
├── pages/            # Route/page components
├── services/         # Business logic and API integrations
│   ├── firebase/     # Firebase services
│   └── calendar/     # Google Calendar integration
├── types/            # TypeScript definitions
├── utils/            # Pure utility functions
├── App.tsx           # Root component
├── main.tsx          # Application entry point
└── index.css         # Global styles
```

## 🎯 Architectural Principles

### 1. **Separation of Concerns**
- **UI (components, pages)** - Presentation and user interaction
- **Logic (hooks, services)** - Business logic and data operations
- **Config** - Initialization and configuration
- **Utils** - Pure, reusable functions

### 2. **Co-location**
- Keep page-specific code within page folders
- Move to shared folders only when reused
- Example: `pages/Dashboard/components/` for Dashboard-only components

### 3. **Clear Dependencies**
```
Pages → Hooks → Services → Config
  ↓       ↓
Components  Utils
  ↓
  UI
```

- Pages and Components consume Hooks
- Hooks use Services and Utils
- Services use Config
- Utils are pure (no dependencies)

### 4. **Import Aliases**
Use path aliases for clean imports:
```typescript
// ❌ Avoid relative imports
import { Button } from '../../../components/ui/Button';

// ✅ Use path aliases
import { Button } from '@/components';
```

Configure in `tsconfig.json` and `vite.config.ts`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## 📦 Module Organization

### Index Files
Each folder has an `index.ts` that exports all public APIs:
```typescript
// components/index.ts
export { Button } from './ui/Button';
export { Header } from './layout/Header';

// Usage in other files
import { Button, Header } from '@/components';
```

### Barrel Exports
Avoid deep imports by using barrel exports:
```typescript
// ❌ Deep import
import { formatDate } from '@/utils/date';
import { truncate } from '@/utils/string';

// ✅ Barrel export
import { formatDate, truncate } from '@/utils';
```

## 🔥 Firebase Integration

### Configuration
- Firebase initialization: `config/firebase.ts`
- Export `auth`, `db` instances for use across the app

### Services
- Firestore operations: `services/firebase/firestore.ts`
- Auth methods: `services/firebase/auth.ts`

### Hooks
- Wrap Firebase services in hooks for reactive data
- Example: `useEvents()` wraps Firestore event queries

## 🚀 Getting Started

When adding a new feature:

1. **Define types** in `types/models.ts`
2. **Create services** in `services/` for data operations
3. **Build hooks** in `hooks/` to consume services
4. **Create components** in `components/` for UI
5. **Build pages** in `pages/` that compose everything

## 📝 Naming Conventions

- **Components**: PascalCase (`Button.tsx`, `EventCard.tsx`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useEvents.ts`)
- **Services**: camelCase (`firestore.ts`, `googleCalendar.ts`)
- **Utils**: camelCase (`date.ts`, `validation.ts`)
- **Types**: PascalCase for interfaces/types (`User`, `Event`)

## 🔍 Quick Reference

| Need to... | Put it in... |
|------------|-------------|
| Add a reusable button | `components/ui/Button.tsx` |
| Create a new page | `pages/PageName.tsx` |
| Add Firebase query | `services/firebase/firestore.ts` |
| Create custom hook | `hooks/useHookName.ts` |
| Define data model | `types/models.ts` |
| Add date formatter | `utils/date.ts` |
| Initialize Firebase | `config/firebase.ts` |
| Add auth logic | `auth/AuthProvider.tsx` |
