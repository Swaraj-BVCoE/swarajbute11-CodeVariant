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
    <div className="relative overflow-hidden border-b border-[#E6E4DD]/80 bg-gradient-to-b from-white/95 via-white/80 to-[#FAF9F6]/90 px-6 py-10 backdrop-blur-md sm:px-10 sm:py-12 xl:px-14">
      {/* Multi-color ambient glow orbs */}
      <div className="pointer-events-none absolute -top-24 right-1/4 -z-10 size-96 rounded-full bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-pink-500/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 right-10 -z-10 size-80 rounded-full bg-gradient-to-br from-cyan-400/15 via-emerald-400/10 to-amber-300/15 blur-3xl" />

      <div className={show3DScene
        ? "relative z-10 grid gap-8 md:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.92fr)] md:items-center"
        : "relative z-10 flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between"}
      >
        <div className={show3DScene ? "max-w-2xl" : "max-w-3xl"}>
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
          {show3DScene && action && <div className="relative z-10 mt-6">{action}</div>}
        </div>
        {show3DScene && (
          <div className="hero-artifact-stage relative min-h-56 overflow-hidden rounded-[1.75rem] border border-white/80 bg-gradient-to-br from-indigo-950 via-slate-900 to-teal-950 shadow-2xl shadow-indigo-950/20 sm:min-h-64 md:min-h-72" aria-label="Interactive project memory artifact">
            <div className="pointer-events-none absolute inset-3 rounded-[1.3rem] border border-white/10" />
            <Suspense fallback={<div className="absolute inset-0 animate-pulse bg-gradient-to-br from-indigo-500/20 to-teal-400/10" />}>
              <HeroScene3D />
            </Suspense>
            <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/15 bg-slate-950/45 px-3 py-1 text-[0.62rem] font-bold uppercase tracking-[0.15em] text-white/75 backdrop-blur-md">
              Living idea artifact
            </span>
          </div>
        )}
        {!show3DScene && action && <div className="relative z-10 shrink-0 pt-2 xl:pt-0">{action}</div>}
      </div>
    </div>
  );
}
