# Components

Reusable UI components used across the application.

## What belongs here:
- **Common UI components** - Buttons, cards, modals, forms, inputs
- **Layout components** - Header, footer, navigation, sidebar
- **Shared feature components** - Components used in multiple pages

## Organization:
```
components/
├── ui/           # Basic UI primitives (Button, Input, Card, etc.)
├── layout/       # Layout components (Header, Footer, Sidebar)
├── forms/        # Form-specific components
└── [feature]/    # Feature-specific shared components
```

## Examples:
- `ui/Button.tsx` - Reusable button component
- `layout/Header.tsx` - App header
- `forms/TextInput.tsx` - Form input component
- `events/EventCard.tsx` - Card component for events (if used in multiple places)

## Note:
- Keep components focused and single-responsibility
- Co-locate component-specific styles if not using Tailwind
- Page-specific components go in `/pages/[page-name]/components`
