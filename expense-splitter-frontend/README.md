# Expense Splitter Frontend

A modern expense splitting application built with Next.js, TypeScript, and shadcn/ui.

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React Hooks

## Prerequisites

- Node.js 18+ installed
- Backend API running on port 3001 (see `expense-splitter-backend`)

## Getting Started

1. **Install dependencies**:
```bash
npm install
```

2. **Configure environment variables**:
```bash
cp .env.example .env.local
```

Edit `.env.local` if needed:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. **Run the development server**:
```bash
npm run dev
```

4. **Open the app**:
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/              # Next.js app router pages
│   ├── layout.tsx    # Root layout
│   └── page.tsx      # Home page
├── components/       # React components
│   └── ui/           # shadcn/ui components
├── lib/              # Utility functions
├── services/         # API client and services
├── types/            # TypeScript type definitions
└── hooks/            # Custom React hooks
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Features

- Modern, responsive UI with shadcn/ui components
- Type-safe API client
- Environment-based configuration
- Optimized fonts with next/font

## API Integration

The app connects to the backend API through the configured `NEXT_PUBLIC_API_URL`. API client is available at `src/services/api.ts`.

## Adding shadcn/ui Components

To add more shadcn/ui components:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog
```

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
