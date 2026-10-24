import type { TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn("min-h-28 w-full resize-y rounded-xl border border-white/10 bg-black/25 px-3.5 py-3 text-sm leading-6 text-[#fffaf0] shadow-[inset_0_2px_8px_rgba(0,0,0,.18),inset_0_1px_rgba(255,255,255,.035)] outline-none transition placeholder:text-slate-600 hover:border-white/15 focus:border-[#ff8f4c]/65 focus:bg-black/35 focus:ring-2 focus:ring-[#ff6422]/15", className)} {...props} />;
}
