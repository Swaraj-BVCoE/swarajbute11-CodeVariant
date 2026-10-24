import { ArrowUpRight, Bookmark, BookmarkCheck, CheckCircle2, Circle, Clock3 } from "lucide-react";
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

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1 hover:border-violet-300/20 hover:shadow-[0_24px_80px_rgba(0,0,0,.3)]">
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
            {project.revisitLater ? <BookmarkCheck className="size-4 text-amber-300" /> : <Bookmark className="size-4" />}
          </Button>
        </div>
        <Link to={`/projects/${project.id}`} className="mt-5 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
          <h3 className="font-display text-xl font-bold tracking-tight text-white transition-colors group-hover:text-violet-100">{project.name}</h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-slate-400">{project.shortDescription}</p>
        </Link>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((technology) => <Badge key={technology} variant="neutral">{technology}</Badge>)}
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-white/[0.07] py-4 text-xs">
          <span className="flex items-center gap-2 text-slate-400"><CheckCircle2 className="size-3.5 text-emerald-300" /> {completed} completed</span>
          <span className="flex items-center gap-2 text-slate-400"><Circle className="size-3.5 text-violet-300" /> {remaining} unfinished</span>
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
