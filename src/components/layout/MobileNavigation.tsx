import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { navigationItems } from "./navigation";

export function MobileNavigation() {
  return (
    <nav
      className="mobile-dock fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-[1.4rem] border border-white/15 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl lg:hidden"
      aria-label="Mobile navigation"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) => cn("flex min-w-0 flex-col items-center gap-1 rounded-xl py-1.5 text-[0.62rem] font-semibold text-slate-500 transition", isActive && "bg-[#ffd21c] text-[#17130c] shadow-[0_6px_20px_rgba(255,210,28,.2)]")}
          >
            <Icon className="size-[1.15rem]" aria-hidden="true" />
            <span className="max-w-full truncate px-1">{item.label.replace(" Projects", "")}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
