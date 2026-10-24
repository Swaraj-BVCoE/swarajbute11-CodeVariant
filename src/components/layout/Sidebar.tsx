import { Bookmark, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Badge } from "../ui/Badge";
import { useArchive } from "../../features/archive/ArchiveContext";
import { Brand } from "./Brand";
import { navigationItems } from "./navigation";

export function Sidebar() {
  const { projects } = useArchive();
  return (
    <aside className="premium-sidebar fixed inset-y-0 left-0 z-30 hidden w-[18.5rem] flex-col px-5 py-6 lg:flex">
      <div className="pb-8 pt-1">
        <Brand />
      </div>

      <p className="px-3 pb-2.5 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#858780]">
        Archive Collections
      </p>

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
                  "group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-[#5C605A] transition-all duration-200 hover:bg-[#F3F2EE] hover:text-[#252724]",
                  isActive && "nav-active font-medium",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "grid size-8 place-items-center rounded-lg bg-[#EFECE5] text-[#5C605A] transition-colors group-hover:bg-[#E4E0D7] group-hover:text-[#252724]",
                      isActive && "bg-[#606E54] text-white group-hover:bg-[#606E54] group-hover:text-white",
                    )}
                  >
                    <Icon className="size-4" aria-hidden="true" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold tracking-[-0.01em]">{item.label}</span>
                    <span
                      className={cn(
                        "block truncate text-[0.73rem] text-[#858780]",
                        isActive && "text-[#5C605A]",
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

      <div className="sidebar-vault mt-auto rounded-xl p-4">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="grid size-8 place-items-center rounded-lg bg-[#EBF0E6] text-[#606E54]">
            <ShieldCheck className="size-4.5" />
          </span>
          <Badge variant="emerald">Local vault</Badge>
        </div>
        <p className="text-xs font-semibold text-[#252724]">Private & On-Device</p>
        <p className="mt-1 text-[0.76rem] leading-relaxed text-[#686B66]">
          {projects.length} {projects.length === 1 ? "idea" : "ideas"} preserved safely in this browser.
        </p>
      </div>
    </aside>
  );
}
