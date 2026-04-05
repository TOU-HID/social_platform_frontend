# Social Platform Frontend

Frontend client for the Social Platform assignment.

## Tech Stack

- React 19
- TypeScript
- Vite
- TanStack Query
- React Router

## Prerequisites

- Node.js 18+ (recommended: Node 20 LTS)
- npm 9+

## Environment Setup

1. Copy env file:

```bash
cp .env.example .env
```

2. Set backend API URL in `.env`:

```dotenv
VITE_API_BASE_URL=http://localhost:5050
```

For production, use your deployed backend URL.

## Install Dependencies

```bash
npm install
```

## Run the Project

Start development server:

```bash
npm run dev
```

Default local URL:

```text
http://localhost:5173
```

## Build for Production

```bash
npm run build
```

Preview production build locally:

```bash
npm run preview
```

## Lint

```bash
npm run lint
```

## Common Commands

- `npm run dev` → Run in development
- `npm run build` → Type-check + production build
- `npm run preview` → Preview built app
- `npm run lint` → Run ESLint

## Notes

- Frontend authentication relies on backend cookies and access tokens.
- Make sure backend CORS `CLIENT_ORIGIN` matches your frontend URL.
