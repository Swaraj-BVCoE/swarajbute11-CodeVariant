import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  RotateCcw,
  HeartPulse,
  Archive,
  Terminal
} from "lucide-react";
import { useDesktop, type WindowId } from "./DesktopContext";
import { useArchive } from "../../features/archive/ArchiveContext";

interface DesktopShortcut {
  id: WindowId;
  label: string;
  icon: React.ReactNode;
  bgGradient: string;
  description: string;
}

export function DesktopShortcuts() {
  const { openWindow } = useDesktop();
  const { projects } = useArchive();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const shortcuts: DesktopShortcut[] = [
    {
      id: "all-projects",
      label: "Project Vault",
      icon: <FolderKanban className="size-8 text-indigo-600" />,
      bgGradient: "from-indigo-50 to-blue-50 border-indigo-200/70",
      description: `${projects.length} preserved ideas`,
    },
    {
      id: "add-project",
      label: "New Project",
      icon: <Plus className="size-8 text-purple-600" />,
      bgGradient: "from-purple-50 to-pink-50 border-purple-200/70",
      description: "Preserve momentum",
    },
    {
      id: "revisit",
      label: "Revisit Later",
      icon: <RotateCcw className="size-8 text-amber-600" />,
      bgGradient: "from-amber-50 to-orange-50 border-amber-200/70",
      description: `${projects.filter((p) => p.revisitLater).length} awaiting reflection`,
    },
    {
      id: "revived",
      label: "Revived Ideas",
      icon: <HeartPulse className="size-8 text-emerald-600" />,
      bgGradient: "from-emerald-50 to-teal-50 border-emerald-200/70",
      description: "Ideas back in motion",
    },
    {
      id: "archived",
      label: "Indefinite Archive",
      icon: <Archive className="size-8 text-rose-600" />,
      bgGradient: "from-rose-50 to-pink-50 border-rose-200/70",
      description: "Sleeping peacefully",
    },
    {
      id: "terminal",
      label: "Graveyard Shell",
      icon: <Terminal className="size-8 text-slate-800" />,
      bgGradient: "from-slate-100 to-slate-200 border-slate-300",
      description: "CLI inspection tool",
    },
  ];

  return (
    <div
      className="absolute top-12 left-5 z-10 flex flex-col gap-3 select-none"
      onClick={() => setSelectedId(null)}
    >
      {shortcuts.map((sc) => {
        const isSelected = selectedId === sc.id;

        return (
          <button
            key={sc.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedId(sc.id);
            }}
            onDoubleClick={(e) => {
              e.stopPropagation();
              openWindow(sc.id);
            }}
            className={`group relative flex w-24 flex-col items-center rounded-xl p-2 text-center transition-all ${
              isSelected
                ? "bg-indigo-600/15 ring-2 ring-indigo-500/80 shadow-md backdrop-blur-sm"
                : "hover:bg-white/40"
            }`}
            title={`Double-click to open ${sc.label}`}
          >
            <div
              className={`flex size-14 items-center justify-center rounded-2xl border shadow-sm backdrop-blur-md transition-transform duration-200 group-hover:scale-105 group-hover:shadow-md bg-white/90 ${sc.bgGradient}`}
            >
              {sc.icon}
            </div>
            <span
              className={`mt-1.5 line-clamp-2 text-xs font-semibold leading-tight text-[#252724] drop-shadow-xs ${
                isSelected ? "text-indigo-900 font-bold" : ""
              }`}
            >
              {sc.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
