# Implementation checkpoints

## Checkpoint 1 — Strong foundation and application shell

**Status:** Completed on 24 October 2026.

### Completed work

- Created a React 19 + Vite 8 application with strict TypeScript 6 checking.
- Added Tailwind CSS 4 and shared design tokens for colour, surfaces, radii, and shadows.
- Added shadcn-style reusable `Button`, `Input`, `Card`, and `Badge` primitives.
- Added React Router routes for All Projects, Add Project, Project Details, Edit Project, Revisit Later, Revived Projects, Archived Projects, and a custom not-found page.
- Built a responsive desktop sidebar, compact mobile header, and fixed mobile navigation.
- Built a polished dashboard shell using the navy, violet, and emerald visual system.
- Added subtle route transitions with Motion and accessible reduced-motion behaviour.
- Added clearly labelled placeholders for features assigned to later checkpoints.
- Added `.env.example`, repository-safe ignores, initial README, and development/validation scripts.
- Pinned compatible dependency versions and generated `pnpm-lock.yaml`.

### Checks completed

- `pnpm typecheck` — passed.
- `pnpm lint` — passed.
- `pnpm build` — passed with Vite 8.3.5.
- `pnpm peers check` — passed with no peer dependency issues.
- Development server response — HTTP 200 at `http://127.0.0.1:5173/`.
- Desktop browser inspection — dashboard layout and sidebar rendered correctly.
- Mobile browser inspection at 390 × 844 — layout, fixed navigation, and content rendered without visible horizontal overflow.
- Navigation inspection — All Projects → Add Project and mobile Revisit Later routes worked.
- Not-found inspection — unknown route rendered the custom 404 experience.

### Known limitations

- All project data, counts, search, filters, and persistence are intentionally placeholders until Checkpoint 2.
- Add/edit/details workflows are intentionally placeholders until Checkpoint 3.
- Supabase, authentication, and 3D visualization are intentionally not installed or implemented.
- Browser QA covered representative desktop/mobile routes; automated browser tests are not part of this checkpoint.

### Next checkpoint

Checkpoint 2 will add the typed project data model, a repository abstraction, versioned localStorage persistence, seed data, derived dashboard counts, search, filters, sorting, and archive views. Do not start it without explicit approval.
