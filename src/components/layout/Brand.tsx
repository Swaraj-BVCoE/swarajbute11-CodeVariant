import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="The Project Graveyard home">
      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl border border-violet-300/20 bg-violet-400/10 text-violet-200 shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
        <Sparkles className="size-5 transition-transform duration-300 group-hover:rotate-12" aria-hidden="true" />
        <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,.8)]" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate font-display text-sm font-bold tracking-wide text-white">The Project Graveyard</span>
          <span className="block truncate text-[0.68rem] uppercase tracking-[0.18em] text-slate-500">Unfinished, remembered</span>
        </span>
      )}
    </Link>
  );
}
