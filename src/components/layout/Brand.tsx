import { Link } from "react-router-dom";

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex min-w-0 items-center gap-3.5" aria-label="The Project Graveyard home">
      <span className="relative grid size-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-tr from-[#2f6bff] via-[#ff725e] to-[#ffc857] p-0.5 shadow-md shadow-[#2f6bff]/20 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
        <span className="grid size-full place-items-center rounded-[0.85rem] bg-white p-1">
          <img
            src="/brand/project-graveyard-mark.png"
            alt=""
            className="size-7 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-110"
          />
        </span>
      </span>
      {!compact && (
        <span className="min-w-0">
          <span className="block truncate font-display text-[1.18rem] font-bold tracking-tight text-[#252724] transition-colors group-hover:text-[#2f6bff]">
            Project Graveyard
          </span>
          <span className="block truncate bg-gradient-to-r from-[#2f6bff] via-[#ff725e] to-[#a15ee8] bg-clip-text text-[0.66rem] font-bold uppercase tracking-[0.2em] text-transparent">
            3D Idea Vault
          </span>
        </span>
      )}
    </Link>
  );
}
