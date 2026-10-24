import React from "react";
import {
  FolderKanban,
  Plus,
  RotateCcw,
  HeartPulse,
  Archive,
  Settings,
  Terminal,
  LayoutGrid
} from "lucide-react";
import { useDesktop, type WindowId } from "./DesktopContext";
import { useArchive } from "../../features/archive/ArchiveContext";

export function DesktopDock() {
  const {
    windows,
    activeWindowId,
    openWindow,
    focusWindow,
    minimizeWindow,
    setLauncherOpen
  } = useDesktop();
  const { projects } = useArchive();

  const dockApps: { id: WindowId; label: string; icon: React.ReactNode; color: string; badge?: number }[] = [
    {
      id: "all-projects",
      label: "Project Vault",
      icon: <FolderKanban className="size-6 text-indigo-600" />,
      color: "from-indigo-500/10 to-blue-500/10",
      badge: projects.length,
    },
    {
      id: "add-project",
      label: "Preserve New",
      icon: <Plus className="size-6 text-purple-600" />,
      color: "from-purple-500/10 to-pink-500/10",
    },
    {
      id: "revisit",
      label: "Revisit Later",
      icon: <RotateCcw className="size-6 text-amber-600" />,
      color: "from-amber-500/10 to-orange-500/10",
      badge: projects.filter((p) => p.revisitLater).length,
    },
    {
      id: "revived",
      label: "Revived",
      icon: <HeartPulse className="size-6 text-emerald-600" />,
      color: "from-emerald-500/10 to-teal-500/10",
      badge: projects.filter((p) => p.status === "reviving").length,
    },
    {
      id: "archived",
      label: "Archived",
      icon: <Archive className="size-6 text-rose-600" />,
      color: "from-rose-500/10 to-pink-500/10",
      badge: projects.filter((p) => p.status === "archived").length,
    },
    {
      id: "terminal",
      label: "Linux Shell",
      icon: <Terminal className="size-6 text-slate-800" />,
      color: "from-slate-500/10 to-slate-700/10",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="size-6 text-cyan-600" />,
      color: "from-cyan-500/10 to-blue-500/10",
    },
  ];

  const handleAppClick = (id: WindowId) => {
    const win = windows[id];
    if (!win.isOpen) {
      openWindow(id);
    } else if (win.isMinimized) {
      focusWindow(id);
    } else if (activeWindowId === id) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  return (
    <nav
      aria-label="Desktop application dock"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/80 px-3 py-2 shadow-2xl shadow-indigo-950/15 backdrop-blur-2xl transition-all duration-300"
    >
      <button
        type="button"
        onClick={() => setLauncherOpen((prev) => !prev)}
        className="group relative flex size-12 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-100 to-white text-slate-700 shadow-xs transition-all duration-200 hover:-translate-y-1.5 hover:shadow-md active:translate-y-0"
        title="Show Applications"
        aria-label="Show Applications launcher"
      >
        <LayoutGrid className="size-5 text-indigo-600 transition group-hover:scale-110" />
        <span className="pointer-events-none absolute -top-8 scale-0 rounded-md bg-[#252724] px-2 py-0.5 text-[11px] font-semibold text-white transition group-hover:scale-100">
          Launcher
        </span>
      </button>

      <div className="h-6 w-px bg-slate-200/80 mx-1" />

      {dockApps.map((app) => {
        const win = windows[app.id];
        const isOpen = win.isOpen;
        const isMinimized = win.isMinimized;
        const isActive = activeWindowId === app.id && isOpen && !isMinimized;

        return (
          <button
            key={app.id}
            type="button"
            onClick={() => handleAppClick(app.id)}
            className={`group relative flex size-12 items-center justify-center rounded-xl border border-white/60 bg-gradient-to-br ${app.color} shadow-xs transition-all duration-200 hover:-translate-y-1.5 hover:shadow-lg active:translate-y-0 ${
              isActive ? "ring-2 ring-indigo-500 bg-white shadow-md shadow-indigo-500/20" : "bg-white/70"
            }`}
            title={app.label}
            aria-label={app.label}
          >
            <span className="transition duration-200 group-hover:scale-110">
              {app.icon}
            </span>

            {typeof app.badge === "number" && app.badge > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex size-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white shadow-xs">
                {app.badge}
              </span>
            )}

            {isOpen && (
              <span
                className={`absolute -bottom-1 size-1 rounded-full transition-all ${
                  isActive ? "w-3 bg-indigo-600" : isMinimized ? "bg-slate-400" : "bg-slate-700"
                }`}
              />
            )}

            <span className="pointer-events-none absolute -top-8 scale-0 rounded-md bg-[#252724] px-2 py-0.5 text-[11px] font-semibold text-white whitespace-nowrap shadow-md transition group-hover:scale-100">
              {app.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
