# Community Web App

A modern community web application built with React, TypeScript, and Firebase.

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Backend**: Firebase (Auth, Firestore)
- **Authentication**: Google OAuth
- **Integration**: Google Calendar API
- **Hosting**: Vercel
- **Code Quality**: ESLint + Prettier

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Page components (route handlers)
├── hooks/          # Custom React hooks
├── lib/            # Utilities and helpers
├── types/          # TypeScript type definitions
├── config/         # Configuration files
├── App.tsx         # Root component
├── main.tsx        # Application entry point
└── index.css       # Global styles with Tailwind directives
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - Run TypeScript compiler check

## Configuration

### Path Aliases

The project uses `@/` as an alias for the `src/` directory:

```typescript
import { Component } from '@/components/Component'
```

### Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client.

See `.env.example` for the full list of required variables.

## Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (with Tailwind CSS plugin)
- No semicolons, single quotes
