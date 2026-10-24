import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="page-header-premium relative border-b border-[#E6E4DD] px-6 py-9 sm:px-10 sm:py-12 xl:px-14">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <p className="mb-2.5 flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.18em] text-[#606E54]">
              <span className="h-px w-5 bg-[#606E54]" />
              {eyebrow}
            </p>
          )}
          <h1 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.025em] text-[#252724] sm:text-4xl xl:text-[2.85rem]">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[0.95rem] leading-relaxed text-[#5C605A] sm:text-base">
            {description}
          </p>
        </div>
        {action && <div className="shrink-0 pt-2 xl:pt-0">{action}</div>}
      </div>
    </div>
  );
}
