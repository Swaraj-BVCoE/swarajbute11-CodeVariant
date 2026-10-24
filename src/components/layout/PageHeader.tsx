import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: PageHeaderProps) {
  return (
    <div className="page-header-premium relative flex flex-col gap-6 overflow-hidden border-b border-white/10 px-5 py-8 sm:px-8 sm:py-11 xl:flex-row xl:items-end xl:justify-between xl:px-12">
      <div className="relative z-10 max-w-3xl">
        {eyebrow && <p className="mb-3 flex items-center gap-2 text-[0.67rem] font-black uppercase tracking-[0.24em] text-[#ffb17a]"><span className="h-px w-7 bg-[#ff6b24]" />{eyebrow}</p>}
        <h1 className="font-display text-4xl font-bold leading-[0.98] tracking-[-0.055em] text-[#fffaf0] sm:text-5xl xl:text-[3.7rem]">{title}</h1>
        <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base sm:leading-7">{description}</p>
      </div>
      {action && <div className="relative z-10 shrink-0">{action}</div>}
      <div className="header-sculpture" aria-hidden="true"><span /><span /><span /></div>
    </div>
  );
}
