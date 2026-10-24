import { ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { useArchive } from "../../features/archive/ArchiveContext";
import { Brand } from "./Brand";
import { navigationItems } from "./navigation";

export function Sidebar() {
  const { projects } = useArchive();
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[18.5rem] flex-col border-r border-[#E6E4DD]/80 bg-white/70 px-5 py-6 backdrop-blur-xl lg:flex">
      <div className="pb-8 pt-1">
        <Brand />
      </div>

      <p className="px-3 pb-2.5 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#858780]">
        Archive Collections
      </p>

      <nav className="space-y-1.5" aria-label="Primary navigation">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const activeGradients = [
            "from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20",
            "from-amber-500 to-orange-500 text-white shadow-md shadow-amber-500/20",
            "from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20",
            "from-rose-500 to-pink-600 text-white shadow-md shadow-rose-500/20",
          ][index % 4];

          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                cn(
                  "group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[#5C605A] transition-all duration-200 hover:bg-white/80 hover:shadow-xs",
                  isActive && "bg-white font-medium text-[#252724] shadow-sm shadow-slate-200/80 border border-slate-200/60",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-lg bg-[#EFECE5]/80 text-[#5C605A] transition-all duration-300 group-hover:scale-105",
                      isActive && `bg-gradient-to-tr ${activeGradients} group-hover:scale-110`,
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold tracking-[-0.01em]">{item.label}</span>
                    <span
                      className={cn(
                        "block truncate text-[0.73rem] text-[#858780]",
                        isActive && "text-slate-600",
                      )}
                    >
                      {item.description}
                    </span>
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="relative mt-auto overflow-hidden rounded-2xl border border-white/80 bg-gradient-to-br from-white/90 via-white/80 to-indigo-50/40 p-4.5 shadow-lg shadow-slate-200/40 backdrop-blur-md">
        <div className="pointer-events-none absolute -bottom-6 -right-6 size-24 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl" />
        <div className="mb-2.5 flex items-center justify-between">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-tr from-emerald-500 to-teal-600 text-white shadow-xs shadow-emerald-500/30">
            <ShieldCheck className="size-4.5" />
          </span>
          <Badge variant="emerald" className="bg-emerald-50 text-emerald-700 border-emerald-200">
            Local 3D Vault
          </Badge>
        </div>
        <p className="text-xs font-bold text-[#252724]">Private & On-Device</p>
        <p className="mt-1 text-[0.76rem] leading-relaxed text-[#686B66]">
          {projects.length} {projects.length === 1 ? "idea" : "ideas"} preserved safely in this browser.
        </p>
      </div>
    </aside>
  );
}
