import { ArrowUpRight, CheckCircle2, Circle, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { abandonmentReasonLabels, type Project } from "../../domain/project";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { StatusBadge } from "./StatusBadge";
import { Tilt3DCard } from "../../components/3d/Tilt3DCard";
import { DraggableCanvasCard } from "../canvas-protocol/DraggableCanvasCard";

function formatUpdatedDate(value: string) {
  const date = new Date(value);
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

// Map project ID to a unique vibrant theme
const projectColorThemes = [
  { glow: "indigo" as const, grad: "from-blue-500/10 via-sky-500/8 to-transparent", border: "hover:border-blue-300", artifact: "project-gem-blue" },
  { glow: "rose" as const, grad: "from-orange-500/10 via-rose-500/8 to-transparent", border: "hover:border-orange-300", artifact: "project-gem-coral" },
  { glow: "cyan" as const, grad: "from-emerald-500/10 via-cyan-500/8 to-transparent", border: "hover:border-emerald-300", artifact: "project-gem-mint" },
  { glow: "amber" as const, grad: "from-amber-500/12 via-yellow-500/8 to-transparent", border: "hover:border-amber-300", artifact: "project-gem-gold" },
  { glow: "emerald" as const, grad: "from-lime-500/10 via-emerald-500/8 to-transparent", border: "hover:border-lime-300", artifact: "project-gem-lime" },
  { glow: "violet" as const, grad: "from-violet-500/9 via-blue-500/7 to-transparent", border: "hover:border-violet-300", artifact: "project-gem-violet" },
];

export function ProjectCard({ project }: { project: Project }) {
  const completed = project.workItems.filter((item) => item.completed).length;
  const remaining = project.workItems.length - completed;

  let hash = 0;
  for (let i = 0; i < project.id.length; i++) hash = project.id.charCodeAt(i) + ((hash << 5) - hash);
  const theme = projectColorThemes[Math.abs(hash) % projectColorThemes.length];

  return (
    <DraggableCanvasCard
      data={{ kind: "canvas-card", cardType: "project-record", cardId: `project:${project.id}`, projectId: project.id, label: project.name }}
      className="h-full"
      handleLabel={`Drag ${project.name} to an action zone`}
    >
      <Tilt3DCard glowColor={theme.glow} className="h-full">
        <div className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/70 bg-white/85 shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all duration-300 ${theme.border} hover:shadow-2xl`}>
        {/* Multi-color ambient background accent */}
        <div className={`pointer-events-none absolute -right-12 -top-12 size-40 rounded-full bg-gradient-to-br ${theme.grad} blur-2xl opacity-60 transition-opacity duration-300 group-hover:opacity-100`} />

        <div className="flex flex-1 flex-col p-6 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <StatusBadge status={project.status} />
            <span className="rounded-full border border-[#E5DDD0] bg-[#FFF9F0] px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-[#A14F2B]">
              Canvas ready
            </span>
          </div>

          <div className="mt-4 flex items-start gap-4">
            <Link
              to={`/projects/${project.id}`}
              className="min-w-0 flex-1 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <h3 className="font-display text-xl font-semibold tracking-[-0.015em] text-[#252724] transition-colors group-hover:text-indigo-600 sm:text-2xl">
                {project.name}
              </h3>
              <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-[#5C605A]">
                {project.shortDescription}
              </p>
            </Link>

            {/* Lightweight CSS 3D artifact avoids one WebGL context per card. */}
            <div className="project-gem-stage" aria-hidden="true">
              <span className={"project-gem " + theme.artifact}>
                <i />
                <b />
              </span>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 3).map((technology, idx) => {
              const tagColors = [
                "bg-sky-50 text-sky-700 border-sky-200",
                "bg-purple-50 text-purple-700 border-purple-200",
                "bg-emerald-50 text-emerald-700 border-emerald-200",
              ][idx % 3];
              return (
                <span
                  key={technology}
                  className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium tracking-tight ${tagColors}`}
                >
                  {technology}
                </span>
              );
            })}
            {project.technologies.length > 3 && (
              <Badge variant="neutral">+{project.technologies.length - 3}</Badge>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2 border-y border-[#E6E4DD]/80 py-3.5 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-emerald-700">
              <CheckCircle2 className="size-3.5 text-emerald-600" />
              <span>{completed} completed</span>
            </span>
            <span className="flex items-center gap-1.5 font-medium text-amber-700">
              <Circle className="size-3.5 text-amber-500" />
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
              className="size-8 shrink-0 rounded-full text-[#858780] hover:bg-indigo-50 hover:text-indigo-600"
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
        </div>
        </div>
      </Tilt3DCard>
    </DraggableCanvasCard>
  );
}
