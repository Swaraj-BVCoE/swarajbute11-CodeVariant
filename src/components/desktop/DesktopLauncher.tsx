import { useState } from "react";
import {
  Search,
  FolderKanban,
  Plus,
  RotateCcw,
  HeartPulse,
  Archive,
  Settings,
  Terminal,
  X
} from "lucide-react";
import { useDesktop, type WindowId } from "./DesktopContext";
import { useArchive } from "../../features/archive/ArchiveContext";

export function DesktopLauncher() {
  const { launcherOpen, setLauncherOpen, openWindow } = useDesktop();
  const { projects } = useArchive();
  const [search, setSearch] = useState("");

  if (!launcherOpen) return null;

  const apps: { id: WindowId; name: string; category: string; description: string; icon: React.ReactNode }[] = [
    {
      id: "all-projects",
      name: "Project Graveyard Vault",
      category: "Repository & Idea Files",
      description: "Browse all unfinished projects, ideas, memory capsules, and 3D artifacts.",
      icon: <FolderKanban className="size-6 text-indigo-600" />,
    },
    {
      id: "add-project",
      name: "Preserve New Project",
      category: "Creation Tool",
      description: "Record a newly halted project, what worked, and your note to future self.",
      icon: <Plus className="size-6 text-purple-600" />,
    },
    {
      id: "revisit",
      name: "Revisit Later",
      category: "Focus & Reflection",
      description: "Quietly explore projects you bookmarked to reflect upon later.",
      icon: <RotateCcw className="size-6 text-amber-600" />,
    },
    {
      id: "revived",
      name: "Revived Ideas",
      category: "Active Momentum",
      description: "Projects sparked back into life with smaller scopes or renewed energy.",
      icon: <HeartPulse className="size-6 text-emerald-600" />,
    },
    {
      id: "archived",
      name: "Permanent Archive",
      category: "Resting Ideas",
      description: "Projects marked as complete or peaceful history without pressure.",
      icon: <Archive className="size-6 text-rose-600" />,
    },
    {
      id: "terminal",
      name: "Graveyard Terminal CLI",
      category: "System Utilities",
      description: "Interactive Linux terminal for project inspection and system statistics.",
      icon: <Terminal className="size-6 text-slate-800" />,
    },
    {
      id: "settings",
      name: "Desktop Settings & Wallpaper",
      category: "Preferences",
      description: "Customize wallpaper, desktop layout, and appearance themes.",
      icon: <Settings className="size-6 text-cyan-600" />,
    },
  ];

  const filteredApps = apps.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.category.toLowerCase().includes(search.toLowerCase()) ||
    app.description.toLowerCase().includes(search.toLowerCase())
  );

  const matchedProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.shortDescription.toLowerCase().includes(search.toLowerCase()) ||
    p.technologies.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 bg-slate-900/25 backdrop-blur-md"
      onClick={() => setLauncherOpen(false)}
    >
      <div
        className="w-[min(92vw,44rem)] overflow-hidden rounded-3xl border border-white/80 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex items-center">
          <Search className="pointer-events-none absolute left-4 size-5 text-slate-400" />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Type to search applications, unfinished projects, or technologies…"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/80 py-3.5 pl-12 pr-10 text-sm font-medium text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-4 focus:ring-indigo-500/15"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 grid size-6 place-items-center rounded-lg text-slate-400 hover:bg-slate-200"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <div className="mt-6 max-h-[60vh] overflow-y-auto space-y-6 pr-1">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-3">
              Applications & Tools
            </h3>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => {
                    openWindow(app.id);
                    setLauncherOpen(false);
                  }}
                  className="flex items-start gap-3.5 rounded-2xl border border-slate-200/60 bg-white p-3.5 text-left transition hover:border-indigo-300 hover:bg-indigo-50/30 hover:shadow-md"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-slate-50 border border-slate-100 shadow-xs">
                    {app.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-900">{app.name}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{app.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {search && matchedProjects.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1 mb-3">
                Matched Projects ({matchedProjects.length})
              </h3>
              <div className="space-y-2">
                {matchedProjects.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      openWindow("project-details", { projectId: p.id, title: p.name });
                      setLauncherOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-white p-3 text-left transition hover:border-indigo-400 hover:bg-indigo-50/20"
                  >
                    <div>
                      <span className="text-sm font-semibold text-slate-900">{p.name}</span>
                      <p className="text-xs text-slate-500 line-clamp-1">{p.shortDescription}</p>
                    </div>
                    <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md">
                      Open Capsule &rarr;
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
