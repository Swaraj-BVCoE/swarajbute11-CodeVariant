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

## Checkpoint 2 — Data model and functioning project archive

**Status:** Completed on 24 October 2026.

### Completed work

- Defined typed models for projects, work items, Memory Capsules, blocker rechecks, scope revisions, revival decisions, and timeline events.
- Added stable IDs, ISO system timestamps, and separate user-entered project dates.
- Added a repository interface with a versioned localStorage implementation kept outside UI components.
- Added five believable first-run examples across paused, revisit-later, reviving, and archived states.
- Prevented automatic reseeding after users remove records; example restoration is an explicit confirmed action.
- Added live archive counts derived from stored records.
- Added project cards with status, technology, progress, pause reason, activity date, and direct detail links.
- Added search across name, description, and technology.
- Added status and abandonment-reason filters, creation/activity sorting, active filter indicators, and Reset Filters.
- Added a persistent Revisit Later toggle and a dedicated derived view.
- Added Revived and Archived views derived from project status.
- Added distinct empty-archive and no-search-results experiences.
- Added confirmed Reset Demo Data and clear guest-browser storage messaging.
- Added graceful malformed-data and failed-write errors; failed writes never update visible state or show success.
- Added a read-only project archive snapshot to make stored context easy to revisit before Checkpoint 3.

### Checks completed

- `pnpm typecheck` — passed.
- `pnpm lint` — passed with no warnings.
- `pnpm test` — 7 tests passed across persistence and filtering suites.
- `pnpm build` — passed with Vite 8.3.5.
- Browser search — matched a technology term, showed a distinct zero-result state, and reset correctly.
- Browser persistence — Revisit Later changed its live count and survived a full page reload.
- Browser reset — confirmation dialog restored all five original examples.
- Browser derived views — Revisit Later displayed exactly the two seeded bookmarked projects after reset.
- Browser navigation — opening a project from a scrolled archive restored the details route to the top.
- Responsive browser inspection — archive rendered correctly at 390 × 844 and 1440 × 900.

### Known limitations

- Add, edit, and delete journeys remain placeholders until Checkpoint 3.
- The project snapshot is read-only; complete Memory Capsule and timeline presentations arrive in later checkpoints.
- Data is intentionally browser-local with no automatic export, cloud sync, or cross-device access.
- Supabase, authentication, and 3D visualization remain intentionally unimplemented.

### Next checkpoint

Checkpoint 3 will add the complete three-step create/edit form, draft recovery, navigation protection, validation, deletion, and timeline-aware project management. Do not start it without explicit approval.
