import { MoonStar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { useArchive } from "../../features/archive/ArchiveContext";
import { Brand } from "./Brand";
import { navigationItems } from "./navigation";

export function Sidebar() {
  const { projects } = useArchive();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[17.5rem] flex-col border-r border-white/[0.07] bg-[#090c14]/95 px-4 py-5 backdrop-blur-xl lg:flex">
      <div className="px-2 pb-8 pt-1"><Brand /></div>
      <p className="px-3 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-600">Archive</p>
      <nav className="space-y-1" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-xl px-3 py-3 text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-100",
                  isActive && "bg-violet-400/10 text-violet-100 ring-1 ring-inset ring-violet-300/10",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn("grid size-9 place-items-center rounded-lg bg-white/[0.04]", isActive && "bg-violet-400/15 text-violet-200")}>
                    <Icon className="size-[1.05rem]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className="block truncate text-[0.72rem] text-slate-600 group-hover:text-slate-500">{item.description}</span>
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="grid size-8 place-items-center rounded-lg bg-emerald-400/10 text-emerald-300"><MoonStar className="size-4" /></span>
          <Badge variant="emerald">Guest mode</Badge>
        </div>
        <p className="text-sm font-semibold text-slate-200">Your ideas stay close.</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{projects.length} {projects.length === 1 ? "project" : "projects"} stored in this browser.</p>
      </div>
    </aside>
  );
}
