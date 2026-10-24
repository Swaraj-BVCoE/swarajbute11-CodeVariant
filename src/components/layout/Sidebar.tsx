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
    <aside className="premium-sidebar fixed inset-y-0 left-0 z-30 hidden w-[18.5rem] flex-col border-r border-white/10 px-4 py-5 backdrop-blur-2xl lg:flex">
      <div className="px-2 pb-8 pt-1"><Brand /></div>
      <p className="px-3 pb-2 text-[0.62rem] font-black uppercase tracking-[0.25em] text-[#ffbb8d]">Collection / 01</p>
      <nav className="space-y-1.5" aria-label="Primary navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3 rounded-2xl px-3 py-3 text-slate-400 transition-all duration-300 hover:translate-x-1 hover:bg-white/[0.055] hover:text-white",
                  isActive && "nav-active text-[#17130c]",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span className={cn("grid size-9 place-items-center rounded-xl bg-white/[0.06] transition-transform duration-300 group-hover:rotate-3", isActive && "bg-black/10 text-[#17130c]")}>
                    <Icon className="size-[1.05rem]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{item.label}</span>
                    <span className={cn("block truncate text-[0.72rem] text-slate-600 group-hover:text-slate-400", isActive && "text-black/55 group-hover:text-black/55")}>{item.description}</span>
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      <div className="sidebar-vault mt-auto rounded-[1.4rem] border border-white/10 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="grid size-9 place-items-center rounded-xl bg-[#d8ff54] text-[#17130c] shadow-[0_8px_25px_rgba(216,255,84,.2)]"><MoonStar className="size-4" /></span>
          <Badge variant="emerald">Local vault</Badge>
        </div>
        <p className="text-sm font-semibold text-slate-200">Your ideas stay close.</p>
        <p className="mt-1 text-xs leading-5 text-slate-500">{projects.length} {projects.length === 1 ? "project" : "projects"} stored in this browser.</p>
      </div>
    </aside>
  );
}
