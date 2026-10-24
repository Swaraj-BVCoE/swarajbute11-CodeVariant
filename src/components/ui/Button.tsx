import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd21c] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-canvas)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "border border-[#ffdd55]/50 bg-gradient-to-br from-[#ffe34f] via-[#ffc51c] to-[#ff8a2b] text-[#1b1307] shadow-[0_10px_30px_rgba(255,152,25,.22),inset_0_1px_rgba(255,255,255,.75),inset_0_-3px_rgba(143,62,0,.16)] hover:-translate-y-0.5 hover:brightness-110",
        secondary: "border border-white/12 bg-white/[0.07] text-slate-100 shadow-[inset_0_1px_rgba(255,255,255,.08),0_10px_25px_rgba(0,0,0,.14)] hover:-translate-y-0.5 hover:border-[#ff9b5f]/25 hover:bg-white/[0.11]",
        ghost: "text-slate-300 hover:bg-white/[0.07] hover:text-[#fffaf0]",
        success: "border border-[#d8ff54]/55 bg-gradient-to-br from-[#efffae] to-[#b6eb36] text-[#172000] shadow-[0_10px_28px_rgba(189,236,55,.17),inset_0_1px_rgba(255,255,255,.7)] hover:-translate-y-0.5 hover:brightness-110",
      },
      size: {
        sm: "h-9 px-3",
        md: "h-11 px-4",
        lg: "h-12 px-5 text-[0.95rem]",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}
