# 🗂️ The Project Graveyard

> *Nothing good is ever truly buried.*

**The Project Graveyard** is a reflective, local-first archive for your unfinished ideas. It helps you preserve a project's context, understand why momentum stopped, and make an intentional decision about what happens next — whether that's reviving it, shrinking its scope, or consciously retiring it.

No account. No cloud. No tracking. Everything lives in your browser.

---

## ✨ Features

### 📦 Project Archive
- Preserve any unfinished project with full context: description, intended outcome, tech stack, work items, and abandonment reason
- Browse all your sleeping ideas in an interactive grid
- Filter by status, search by name, and sort by date or name
- Each project gets a unique **interactive 3D artifact** — a procedurally generated visual identity you can spin and explore

### 🧠 Memory Capsule
A handoff note to your future self, captured at the moment you pause:
- **Last thing that worked** — what was in a good state
- **Exact stopping point** — where the code/work was at
- **Suggested next step** — your best guess at the first move to restart
- **Important links** — docs, PRs, references you'll need
- **Note to future self** — a personal message, encouragement, or warning

### ✨ Reflection & Revival Station
Four structured tools to help you decide a project's fate:

| Tab | Purpose |
|-----|---------|
| ⚡ **Jumpstart** | Check off unfinished tasks one by one to rebuild momentum |
| ✂️ **Shrink the Dream** | Mark each work item as Keep / Postpone / Remove to create a trimmed scope |
| 🧱 **Blocker Recheck** | Reassess a technical or external blocker — mark it as resolved, smaller, or still blocking |
| 🧭 **Revival Decision** | Choose a path: Continue, Restart, Change idea, Repurpose, or Archive |

### 🏠 Productivity Dashboard
- Live stats: total projects, active revivals, paused count, completed
- Recent activity feed (5 most recently updated projects)
- Smart recommendations based on your archive state

### 📅 Full Project Timeline
Every action is recorded — creation, edits, task completions, scope revisions, blocker rechecks, and revival decisions — forming a permanent history of each project's journey.

### 🔒 Local & Private
All data is stored in your browser's `localStorage`. No server, no account, no external tracking required.

---

## 🚀 Run Locally

**Requirements:** Node.js 20.19+ or 22.12+ and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev
```

Open the local URL printed by Vite — normally `http://localhost:5173`.

---

## ✅ Validation

```bash
pnpm typecheck   # TypeScript type checking
pnpm lint        # ESLint
pnpm test        # Vitest unit tests
pnpm build       # Production build
```

---

## 🗺️ Routes

| Route | Page |
|-------|------|
| `/` | All Projects — main archive |
| `/dashboard` | Productivity Dashboard |
| `/projects/new` | Add / Preserve a Project |
| `/projects/:projectId` | Project Details & Reflection Station |
| `/projects/:projectId/edit` | Edit Project |
| `/revisit-later` | Projects flagged for revisiting |
| `/revived` | Projects currently being revived |
| `/archived` | Archived / retired projects |

Unknown paths render the custom not-found page.

---

## 🏗️ Project Structure

```text
src/
  app/          Application routing and providers
  components/   Desktop shell, 3D scenes, dashboard widgets, layout, and shared UI primitives
  data/         Seed records and localStorage persistence
  domain/       Typed project model (Project, MemoryCapsule, WorkItem, TimelineEvent, etc.)
  features/     Archive state (ArchiveContext), filters, project cards, and Reflection Station
  lib/          Shared helpers and utilities
  pages/        Route-level page components
```

---

## 🧩 Project Statuses

| Status | Meaning |
|--------|---------|
| 🟡 **Paused** | On hold but not forgotten |
| 🔵 **Revisit Later** | Flagged for a future check-in |
| 💚 **Reviving** | Back in active motion |
| 🗄️ **Archived** | Completed or consciously retired |

---

## 💾 Guest Data & Storage

Guest projects are stored in `localStorage` under a versioned key. Example/demo projects are seeded only once — on first visit when the key has never existed.

- Removing all projects leaves the archive empty after reload
- Demo projects return only through the confirmed **Reset demo** action on the archive page
- The Add Project form auto-saves a draft in the browser; returning to the form offers explicit **Restore** or **Discard** options
- If stored data is malformed or a browser write fails, the interface reports the error rather than silently failing

> ⚠️ Clearing browser storage will erase your entire archive. There is no recovery path unless you have a backup.

---

## 🌍 Environment

No environment variables are required for the local guest archive.

`.env.example` contains placeholders for an optional Supabase integration planned for a future checkpoint. **Never commit a populated `.env` file.**

---

## 🛣️ Roadmap

See [`CHECKPOINTS.md`](./CHECKPOINTS.md) for full implementation progress, completed milestones, and known limitations.

---

*Built with React 19, Vite, TypeScript, Tailwind CSS v4, Three.js, and Motion.*
