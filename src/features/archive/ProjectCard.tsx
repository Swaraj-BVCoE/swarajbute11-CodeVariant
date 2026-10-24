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

export function ProjectCard({
  project,
  onToggleRevisit,
}: {
  project: Project;
  onToggleRevisit: (id: string, nextValue: boolean) => void;
}) {
  const completed = project.workItems.filter((item) => item.completed).length;
  const remaining = project.workItems.length - completed;

  return (
    <Card className="group flex h-full flex-col overflow-hidden transition-all duration-200 hover:-translate-y-0.5">
      <CardContent className="flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-3">
          <StatusBadge status={project.status} />
          <Button
            variant="ghost"
            size="icon"
            className="-mr-2 -mt-2 size-8 text-[#858780] hover:text-[#252724]"
            aria-label={project.revisitLater ? `Remove ${project.name} from Revisit Later` : `Save ${project.name} to Revisit Later`}
            aria-pressed={project.revisitLater}
            onClick={() => onToggleRevisit(project.id, !project.revisitLater)}
          >
            {project.revisitLater ? (
              <BookmarkCheck className="size-4 text-[#9E7D4E]" />
            ) : (
              <Bookmark className="size-4" />
            )}
          </Button>
        </div>

        <Link
          to={`/projects/${project.id}`}
          className="mt-4 block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#606E54]"
        >
          <h3 className="font-display text-xl font-medium tracking-[-0.015em] text-[#252724] transition-colors group-hover:text-[#606E54] sm:text-2xl">
            {project.name}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-[#5C605A]">
            {project.shortDescription}
          </p>
        </Link>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.technologies.slice(0, 3).map((technology) => (
            <Badge key={technology} variant="neutral">
              {technology}
            </Badge>
          ))}
          {project.technologies.length > 3 && (
            <Badge variant="neutral">+{project.technologies.length - 3}</Badge>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2 border-y border-[#E6E4DD] py-3.5 text-xs">
          <span className="flex items-center gap-1.5 font-medium text-[#5C605A]">
            <CheckCircle2 className="size-3.5 text-[#606E54]" />
            <span>{completed} completed</span>
          </span>
          <span className="flex items-center gap-1.5 font-medium text-[#858780]">
            <Circle className="size-3.5 text-[#D8C8A8]" />
            <span>{remaining} unfinished</span>
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <p className="truncate text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-[#858780]">
              Why it paused
            </p>
            <p className="mt-0.5 truncate text-[0.84rem] font-medium text-[#252724]">
              {abandonmentReasonLabels[project.abandonmentReason]}
            </p>
          </div>
          <Button
            asChild
            variant="ghost"
            size="icon"
            className="size-8 shrink-0 rounded-full text-[#858780] hover:bg-[#F3F2EE] hover:text-[#252724]"
            aria-label={`Open ${project.name}`}
          >
            <Link to={`/projects/${project.id}`}>
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>

        <p className="mt-auto flex items-center gap-1.5 pt-5 text-[0.72rem] text-[#858780]">
          <Clock3 className="size-3" />
          <span>Updated {formatUpdatedDate(project.updatedAt)}</span>
        </p>
      </CardContent>
    </Card>
  );
}
