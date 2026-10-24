import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
  {
    variants: {
      variant: {
        violet: "border-violet-400/20 bg-violet-400/10 text-violet-200",
        emerald: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
        amber: "border-amber-400/20 bg-amber-400/10 text-amber-200",
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
