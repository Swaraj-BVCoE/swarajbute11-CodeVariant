import { ChevronDown } from "lucide-react";
import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select
        className={cn(
          "h-10.5 w-full appearance-none rounded-lg border border-[#D8D6CE] bg-white py-0 pl-3.5 pr-9 text-sm text-[#252724] shadow-xs outline-none transition-all hover:border-[#BCB9AF] focus:border-[#606E54] focus:ring-2 focus:ring-[#606E54]/20",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#858780]" aria-hidden="true" />
    </div>
  );
}
