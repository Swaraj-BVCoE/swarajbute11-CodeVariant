import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "min-h-24 w-full resize-y rounded-lg border border-[#D8D6CE] bg-white px-3.5 py-2.5 text-sm leading-relaxed text-[#252724] placeholder:text-[#858780] shadow-xs outline-none transition-all hover:border-[#BCB9AF] focus:border-[#606E54] focus:ring-2 focus:ring-[#606E54]/20",
        className,
      )}
      {...props}
    />
  );
}
