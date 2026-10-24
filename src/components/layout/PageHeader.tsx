import { lazy, Suspense, type ReactNode } from "react";

const HeroScene3D = lazy(() => import("../3d/HeroScene3D").then((module) => ({ default: module.HeroScene3D })));

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  action?: ReactNode;
  show3DScene?: boolean;
};

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
  show3DScene = false,
}: PageHeaderProps) {
  return (
    <div className="relative overflow-hidden border-b border-[#E6E4DD]/80 bg-gradient-to-b from-white/95 via-white/80 to-[#FAF9F6]/90 px-6 py-10 backdrop-blur-md sm:px-10 sm:py-14 xl:px-14">
      {/* Dynamic 3D Scene Layer */}
      {show3DScene && <Suspense fallback={null}><HeroScene3D /></Suspense>}

      {/* Multi-color ambient glow orbs */}
      <div className="pointer-events-none absolute -top-24 right-1/4 -z-10 size-96 rounded-full bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 -z-10 size-80 rounded-full bg-gradient-to-br from-cyan-400/15 via-emerald-400/10 to-amber-300/15 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          {eyebrow && (
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-200/60 bg-gradient-to-r from-indigo-50/80 via-purple-50/70 to-pink-50/80 px-3.5 py-1 text-[0.72rem] font-bold uppercase tracking-[0.18em] text-indigo-900 shadow-xs backdrop-blur-sm">
              <span className="size-1.5 animate-pulse rounded-full bg-indigo-500" />
              {eyebrow}
            </div>
          )}
          <h1 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.025em] text-[#252724] sm:text-4xl xl:text-[3rem]">
            {title}
          </h1>
          <p className="mt-3.5 max-w-2xl text-[0.98rem] leading-relaxed text-[#5C605A] sm:text-base">
            {description}
          </p>
        </div>
        {action && <div className="relative z-10 shrink-0 pt-2 xl:pt-0">{action}</div>}
      </div>
    </div>
  );
}
