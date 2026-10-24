import { ArrowUpRight, Bookmark, BookmarkCheck, CheckCircle2, Circle, Clock3 } from "lucide-react";
import type { CSSProperties, PointerEvent } from "react";
import { Link } from "react-router-dom";
import { abandonmentReasonLabels, type Project } from "../../domain/project";
import { Card, CardContent } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "./StatusBadge";

function formatUpdatedDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function ProjectCard({ project, onToggleRevisit }: { project: Project; onToggleRevisit: (id: string, nextValue: boolean) => void }) {
  const completed = project.workItems.filter((item) => item.completed).length;
  const remaining = project.workItems.length - completed;
  const palettes = [
    { gradient: "linear-gradient(90deg, #ff5b22, #ffd21c)", glow: "rgba(255,100,34,.45)" },
    { gradient: "linear-gradient(90deg, #d8ff54, #ffd21c)", glow: "rgba(216,255,84,.35)" },
    { gradient: "linear-gradient(90deg, #3168ff, #72a0ff)", glow: "rgba(49,104,255,.38)" },
  ];
  const palette = palettes[project.id.split("").reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % palettes.length];
  const cardStyle = { "--project-gradient": palette.gradient, "--project-glow": palette.glow } as CSSProperties;

  const tiltCard = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    event.currentTarget.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
    event.currentTarget.style.setProperty("--ry", `${(x - 0.5) * 6}deg`);
    event.currentTarget.style.setProperty("--shine-x", `${x * 100}%`);
    event.currentTarget.style.setProperty("--shine-y", `${y * 100}%`);
  };

  const resetTilt = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty("--rx", "0deg");
    event.currentTarget.style.setProperty("--ry", "0deg");
  };

  return (
    <Card className="project-card-3d group flex h-full flex-col overflow-hidden transition duration-300 hover:border-[#ffb47f]/25 hover:shadow-[0_32px_95px_rgba(0,0,0,.38)]" style={cardStyle} onPointerMove={tiltCard} onPointerLeave={resetTilt}>
      <span className="project-accent" aria-hidden="true" />
      <CardContent className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={project.status} />
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 -mt-2 size-9"
            aria-label={project.revisitLater ? `Remove ${project.name} from Revisit Later` : `Save ${project.name} to Revisit Later`}
            aria-pressed={project.revisitLater}
            onClick={() => onToggleRevisit(project.id, !project.revisitLater)}
          >
            {project.revisitLater ? <BookmarkCheck className="size-4 text-[#ffd21c]" /> : <Bookmark className="size-4" />}
          </Button>
        </div>
        <Link to={`/projects/${project.id}`} className="mt-5 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ffd21c]">
          <h3 className="font-display text-2xl font-bold tracking-[-0.035em] text-[#fffaf0] transition-colors group-hover:text-[#ffd868]">{project.name}</h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">{project.shortDescription}</p>
        </Link>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((technology) => <Badge key={technology} variant="neutral">{technology}</Badge>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-white/[0.07] py-4 text-xs">
          <span className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="size-3.5 text-[#d8ff54]" /> {completed} completed</span>
          <span className="flex items-center gap-2 text-slate-400"><Circle className="size-3.5 text-[#ff9561]" /> {remaining} unfinished</span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[0.68rem] font-bold uppercase tracking-[0.14em] text-slate-600">Why it paused</p>
            <p className="mt-1 truncate text-sm font-medium text-slate-300">{abandonmentReasonLabels[project.abandonmentReason]}</p>
          </div>
          <Button asChild variant="ghost" size="icon" className="shrink-0" aria-label={`Open ${project.name}`}>
            <Link to={`/projects/${project.id}`}><ArrowUpRight className="size-4" /></Link>
          </Button>
        </div>
        <p className="mt-auto flex items-center gap-1.5 pt-5 text-xs text-slate-600"><Clock3 className="size-3.5" /> Updated {formatUpdatedDate(project.updatedAt)}</p>
      </CardContent>
    </Card>
  );
}
