# The Project Graveyard

> Unfinished doesn’t mean forgotten.

The Project Graveyard is a reflective archive for unfinished ideas. It helps people preserve a project’s context, understand why momentum stopped, and make an intentional decision about what happens next.

## Current status

Checkpoint 3 provides the complete local project-management journey: a validated three-step form, create-form draft recovery, dirty-navigation protection, project details, history-preserving edits, deletion confirmation, Memory Capsules, and timeline events.

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
pnpm test
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

No environment variables are needed for the guest archive. `.env.example` contains placeholders for the optional Supabase integration planned for Checkpoint 5. Never commit a populated `.env` file.

## Guest data

Guest projects are stored in this browser under a versioned localStorage record. Example projects are inserted only when the storage key has never existed. Removing all projects will therefore leave the archive empty after reload; examples return only through the confirmed **Reset demo** action.

The Add Project form saves an independent browser-local draft after changes. Returning to the form offers explicit restore or discard actions, and a successful project creation clears the draft.

If stored data is malformed or a browser write fails, the interface reports the error rather than claiming success. Resetting demo data is the recovery path for malformed records.

## Project form

The three steps capture the original idea, completed and unfinished work, present status, historical dates, abandonment context, and a Project Memory Capsule. URLs accept only complete `http://` or `https://` addresses, and historical project dates remain separate from system-created timeline timestamps.

## Structure

```text
src/
  app/          Application routing
  components/   Layout and shared UI primitives
  data/         Seed records and persistence implementation
  domain/       Typed project model
  features/     Archive state, filters, and UI
  lib/          Shared helpers
  pages/        Route-level pages
```

See `CHECKPOINTS.md` for implementation progress and known limitations.
