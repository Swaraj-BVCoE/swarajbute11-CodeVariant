# The Project Graveyard

> Unfinished doesn’t mean forgotten.

The Project Graveyard is a reflective archive for unfinished ideas. It helps people preserve a project’s context, understand why momentum stopped, and make an intentional decision about what happens next.

## Current status

Checkpoint 1 provides the application foundation: React, Vite, strict TypeScript, Tailwind CSS, routing, reusable UI primitives, and a responsive dashboard shell. Data persistence and project workflows intentionally begin in later checkpoints.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and pnpm.

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite (normally `http://localhost:5173`).

## Validation

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## Routes

- `/` — All Projects dashboard
- `/projects/new` — Add Project
- `/projects/:projectId` — Project Details
- `/projects/:projectId/edit` — Edit Project
- `/revisit-later` — Revisit Later
- `/revived` — Revived Projects
- `/archived` — Archived Projects

Unknown paths render the custom not-found page.

## Environment

No environment variables are needed for Checkpoint 1. `.env.example` contains placeholders for the optional Supabase integration planned for Checkpoint 5. Never commit a populated `.env` file.

## Structure

```text
src/
  app/          Application routing
  components/   Layout and shared UI primitives
  lib/          Shared helpers
  pages/        Route-level pages
```

See `CHECKPOINTS.md` for implementation progress and known limitations.
