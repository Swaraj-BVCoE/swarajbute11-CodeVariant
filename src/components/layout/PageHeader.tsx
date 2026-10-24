import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-5 border-b border-white/[0.07] px-5 py-7 sm:px-8 sm:py-9 xl:flex-row xl:items-end xl:justify-between xl:px-12">
      <div className="max-w-2xl">
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-bold tracking-[-0.035em] text-white sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
