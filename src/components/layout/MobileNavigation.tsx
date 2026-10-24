import { NavLink } from "react-router-dom";
import { cn } from "../../lib/utils";
import { navigationItems } from "./navigation";

export function MobileNavigation() {
  return (
    <nav
      className="mobile-dock fixed inset-x-3 bottom-3 z-40 grid grid-cols-5 rounded-2xl border border-[#E6E4DD] px-1.5 py-1.5 backdrop-blur-xl lg:hidden"
      aria-label="Mobile navigation"
    >
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              cn(
                "flex min-w-0 flex-col items-center gap-1 rounded-xl py-2 text-[0.68rem] font-medium text-[#858780] transition",
                isActive ? "bg-[#FAF9F6] text-[#252724] font-semibold shadow-xs" : "hover:text-[#252724]",
              )
            }
          >
            <Icon className="size-[1.12rem]" aria-hidden="true" />
            <span className="max-w-full truncate px-0.5">{item.label.replace(" Projects", "")}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
