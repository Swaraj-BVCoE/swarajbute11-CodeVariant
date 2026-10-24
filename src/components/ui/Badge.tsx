import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        violet: "border-[#ff7b36]/25 bg-[#ff6422]/10 text-[#ffc39f]",
        emerald: "border-[#d8ff54]/25 bg-[#d8ff54]/10 text-[#eaff9f]",
        amber: "border-[#ffd21c]/25 bg-[#ffd21c]/10 text-[#ffe986]",
        neutral: "border-white/10 bg-white/[0.06] text-slate-300",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
