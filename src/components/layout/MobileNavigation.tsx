import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { navigationItems } from "./navigation";

export function MobileNavigation() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-[#090c14]/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => cn("flex min-w-0 flex-col items-center gap-1 rounded-lg py-1.5 text-[0.62rem] font-medium text-slate-500", isActive && "bg-violet-400/10 text-violet-200")}
          >
            <Icon className="size-[1.15rem]" aria-hidden="true" />
            <span className="max-w-full truncate px-1">{item.label.replace(" Projects", "")}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
