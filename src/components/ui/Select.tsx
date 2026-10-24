import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-11 w-full appearance-none rounded-xl border border-white/10 bg-[#0b0f18] py-0 pl-3.5 pr-9 text-sm text-slate-200 outline-none focus:border-violet-400/60 focus:ring-2 focus:ring-violet-400/15",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
    </div>
  );
}
