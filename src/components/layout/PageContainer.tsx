import type { HTMLAttributes } from "react";
import { cn } from "../../lib/utils";

export function PageContainer({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("relative mx-auto w-full max-w-[98rem] px-5 py-7 sm:px-8 sm:py-9 xl:px-12", className)} {...props} />;
}
