import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-12 w-full appearance-none rounded-xl border border-white/10 bg-[#13110d] py-0 pl-3.5 pr-9 text-sm text-slate-200 shadow-[inset_0_2px_8px_rgba(0,0,0,.18),inset_0_1px_rgba(255,255,255,.035)] outline-none transition hover:border-white/15 focus:border-[#ff8f4c]/65 focus:ring-2 focus:ring-[#ff6422]/15",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#ffad75]" aria-hidden="true" />
    </div>
  );
}
