import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex min-w-0 items-center gap-3" aria-label="The Project Graveyard home">
      <span className="relative grid size-10 shrink-0 place-items-center rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] p-1 shadow-sm transition-transform duration-300 group-hover:scale-105">
        <img
          src="/brand/project-graveyard-mark.png"
          alt=""
          className="size-8 object-contain"
        />
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate font-display text-[1.12rem] font-semibold tracking-[-0.02em] text-[#252724]">
            The Project Graveyard
          </span>
          <span className="block truncate text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[#606E54]">
            An Archive for Ideas
          </span>
        </span>
      )}
    </Link>
  );
}
