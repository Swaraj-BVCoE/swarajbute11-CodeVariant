import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-10.5 w-full rounded-lg border border-[#D8D6CE] bg-white px-3.5 text-sm text-[#252724] placeholder:text-[#858780] shadow-xs outline-none transition-all hover:border-[#BCB9AF] focus:border-[#606E54] focus:ring-2 focus:ring-[#606E54]/20",
        className,
      )}
      {...props}
    />
  );
}
