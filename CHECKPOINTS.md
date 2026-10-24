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

## Checkpoint 3 — Complete add, view, edit, and delete journeys

**Status:** Completed on 24 October 2026.

### Completed work

- Added a reusable three-step React Hook Form and Zod project form.
- Step 1 captures required name, description, intended outcome, technology tags, and optional repository/demo links.
- Step 2 supports separate completed and unfinished work items, add/remove controls, current status, and historical dates.
- Step 3 captures the abandonment reason, supporting notes, and the full Project Memory Capsule.
- Added field-level validation, safe `http://`/`https://` URL checks, future-date prevention, and start/last-worked ordering checks.
- Added Back/Continue navigation while preserving values and moving invalid submissions to the relevant step.
- Added browser-local create-form draft autosaving with explicit restore/discard actions.
- Successful project creation clears the saved create draft.
- Added unsaved-change protection for page unload, in-app links, and browser Back navigation.
- Added creation with stable IDs, ISO system timestamps, and a creation timeline event.
- Added editing with existing values while preserving creation time, earlier timeline entries, rechecks, scope revisions, and decisions.
- Meaningful edits append a dated timeline event rather than replacing project history.
- Expanded project details with original intention, work state, Memory Capsule, important links, blocker context, dates, and timeline.
- Added delete confirmation and aggregate deletion of the project plus every nested related record.
- Added repository success/error feedback for create, update, and delete actions.

### Checks completed

- `pnpm typecheck` — passed.
- `pnpm lint` — passed with no warnings.
- `pnpm test` — 14 tests passed across persistence, complete CRUD lifecycle, validation, draft recovery, filtering, and history preservation.
- `pnpm build` — passed with Vite 8.3.5; one non-blocking bundle-size advisory remains.
- Development route response — HTTP 200 for `/projects/new`.

### Verification limitation

- Automated visual browser interaction was blocked by the browser-control URL security policy for the localhost tab. The restriction was not bypassed. UI journeys remain available for manual inspection through `pnpm dev`; repository lifecycle and form logic are covered by automated tests.

### Known limitations

- Browser Back protection uses the native confirmation dialog and returns to the form after cancellation; a future data-router migration could provide a fully custom blocker dialog.
- Draft recovery is intentionally limited to the create form. Edit forms protect unsaved work but do not persist an edit draft.
- Supabase, reflection/revival actions, and the optional 3D archive remain intentionally unimplemented.

### Next checkpoint

Checkpoint 4 will add Blocker Recheck, Shrink the Dream, repeatable revival decisions, and status/timeline consistency. Do not start it without explicit approval.

## Pre–Checkpoint 4 interface redesign — Linux desktop environment

**Status:** Completed on 24 October 2026.

### Completed work

- Reframed the existing React application as a bright Linux-inspired desktop without replacing its routes, archive context, repository, or forms.
- Added draggable, focusable application windows with working minimize, maximize, restore, and close controls.
- Added a top system panel, searchable application/project launcher, desktop shortcuts, dock, two workspaces, context menu, appearance settings, and a functional project-aware terminal.
- Connected dock, launcher, shortcut, and terminal actions to the existing React Router routes.
- Added saved wallpaper preferences and retained a touch-friendly, full-screen mobile presentation.
- Generated and integrated a transparent 3D Project Graveyard logo as the application identity and favicon.
- Added restrained 3D presentation through an on-demand hero scene, project detail artifact, CSS perspective cards, lightweight card artifacts, and a custom fine-pointer cursor.
- Replaced the always-running multi-renderer card/background approach with CSS 3D geometry and lazy-loaded Three.js scenes to reduce memory use and improve initial loading.
- Preserved project creation, editing, deletion, search, filtering, persistence, draft recovery, timeline history, and Memory Capsules.

### Checks completed

- \`pnpm typecheck\` — passed.
- \`pnpm lint\` — passed with no warnings.
- \`pnpm test\` — 14 tests passed.
- \`pnpm build\` — passed; Three.js now builds as an on-demand shared chunk.

### Preview note

- Vite runs at \`http://localhost:5173/\`. The original preview failure was a stopped development process followed by memory exhaustion from multiple simultaneous WebGL renderers. The render load has been reduced and the server relaunched. Automated in-app browser inspection remains unavailable because the browser-control transport closed and the environment blocked a separate localhost probe.

## Canvas Checkpoint 1 — Foundation and representative journey

**Status:** Completed on 24 October 2026.

### Completed work

- Audited every current primary mutation trigger in `CANVAS_ACTION_MAP.md`, including form, dialog, terminal, desktop, and mobile surfaces.
- Added `@dnd-kit/core` and a reusable typed Canvas Protocol layer with explicit card/zone compatibility rules.
- Added pointer activation distance, delayed touch activation, keyboard pickup/movement/drop, Escape cancellation, drag overlays, screen-reader instructions, and announcements.
- Added reusable draggable cards, contextual Action Zones, first-use guidance, and idle, ready, valid, invalid, pending, success, and error presentation states.
- Replaced the create form's final execution button with a live Project Draft card that must be dropped into Save to Archive.
- Kept create validation and draft recovery intact; invalid drops save nothing, surface field errors, and preserve form input.
- Removed the bookmark execution button from project cards. Project records now move into Revisit Later, or back through Return to Collection, only by a valid completed drop.
- Reused the existing `createProject` and `toggleRevisitLater` repository boundaries and revalidated current project state at drop time.
- Refreshed the palette toward warm parchment, mineral teal, and terracotta, with a more editorial Palatino-style display face and Aptos/system body typography.

### Remaining Canvas Checkpoint 2 conversions

- Edit and Memory Capsule persistence, two-stage deletion, demo reset (including the terminal bypass), Blocker Recheck, Shrink the Dream, revival decisions, archive behaviour, and a final primary-action audit.
- The application is therefore not yet fully Canvas Protocol compliant.

### Checks completed

- `pnpm typecheck` — passed.
- `pnpm lint` — passed with no warnings.
- `pnpm test` — 18 tests passed across four suites.
- `pnpm build` — passed; the existing non-blocking bundle-size advisory remains.
- Mobile browser QA — create steps, Project Draft, Save to Archive zone, archive cards, Revisit Later zone, labels, and responsive scrolling rendered correctly.
- WebGL fallback QA — optional 3D scenes no longer blank the application when renderer creation fails.

### Verification limitations

- Browser automation confirmed the accessible drag controls and zones, but the available browser driver did not expose a reliable touch-drag gesture. Touch behavior is implemented through dnd-kit's delayed Touch Sensor and still needs physical-device confirmation.
- Canvas Checkpoint 2 actions remain intentionally unconverted until explicit approval.
