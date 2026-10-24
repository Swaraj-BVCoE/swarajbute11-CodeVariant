import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-medium tracking-tight",
  {
    variants: {
      variant: {
        violet: "border border-[#D4DDD0] bg-[#F2F5F0] text-[#4A5740]",
        emerald: "border border-[#C8D6BE] bg-[#EBF0E6] text-[#3D4C32]",
        amber: "border border-[#E4D8BE] bg-[#F8F4EC] text-[#6E5A35]",
        neutral: "border border-[#E6E4DD] bg-[#F7F7F4] text-[#5C605A]",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
