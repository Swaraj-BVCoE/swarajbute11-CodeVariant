import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="The Project Graveyard home">
      <span className="brand-mark relative grid size-12 shrink-0 place-items-center">
        <img src="/brand/project-graveyard-mark.png" alt="" className="size-12 object-contain transition duration-500 group-hover:-translate-y-1 group-hover:rotate-3 group-hover:scale-110" />
        <span className="absolute -bottom-1 left-1/2 h-2 w-8 -translate-x-1/2 rounded-full bg-orange-500/35 blur-md" />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate font-display text-[1.02rem] font-bold tracking-[-0.02em] text-[#fffaf0]">The Project Graveyard</span>
          <span className="block truncate text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[#d8ff54]">Ideas never expire</span>
        </span>
      )}
    </Link>
  );
}
