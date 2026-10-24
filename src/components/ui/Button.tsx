import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606E54] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[#252724] text-[#FAF9F6] shadow-sm hover:bg-[#3D403C] active:translate-y-px",
        secondary:
          "border border-[#D8D6CE] bg-[#FFFFFF] text-[#252724] shadow-xs hover:bg-[#F7F7F4] hover:border-[#BCB9AF] active:translate-y-px",
        ghost:
          "text-[#5C605A] hover:bg-[#F3F2EE] hover:text-[#252724]",
        success:
          "border border-[#A8B59A] bg-[#606E54] text-[#FFFFFF] shadow-sm hover:bg-[#4E5B43] active:translate-y-px",
      },
      size: {
        sm: "h-8.5 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-5 text-sm font-semibold",
        icon: "size-9",
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
