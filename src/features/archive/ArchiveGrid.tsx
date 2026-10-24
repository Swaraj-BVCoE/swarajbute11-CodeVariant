import { useMemo, useState } from "react";
import type { Project } from "../../domain/project";
import { useArchive } from "./ArchiveContext";
import { ArchiveEmptyState } from "./ArchiveEmptyState";
import { ArchiveToolbar } from "./ArchiveToolbar";
import { ProjectCard } from "./ProjectCard";
import { defaultArchiveFilters, filterAndSortProjects } from "./projectFilters";

type ArchiveGridProps = {
  projects: Project[];
  emptyTitle: string;
  emptyDescription: string;
  showStatusFilter?: boolean;
};

export function ArchiveGrid({ projects, emptyTitle, emptyDescription, showStatusFilter = true }: ArchiveGridProps) {
  const [filters, setFilters] = useState({ ...defaultArchiveFilters });
  const { toggleRevisitLater } = useArchive();
  const visibleProjects = useMemo(() => filterAndSortProjects(projects, filters), [projects, filters]);
  const hasFilters = Boolean(filters.query || filters.status !== "all" || filters.reason !== "all" || filters.sort !== "recent-activity");

  return (
    <>
      <ArchiveToolbar filters={filters} onChange={setFilters} showStatus={showStatusFilter} />
      <div className="mt-4 flex items-center justify-between gap-4">
        <p className="text-sm text-slate-500"><strong className="font-semibold text-slate-300">{visibleProjects.length}</strong> {visibleProjects.length === 1 ? "project" : "projects"}</p>
        <p className="hidden text-xs text-slate-600 sm:block">Stored locally in this browser</p>
      </div>
      <section className="mt-4 grid gap-4 md:grid-cols-2 2xl:grid-cols-3" aria-label="Projects">
        {visibleProjects.map((project) => <ProjectCard key={project.id} project={project} onToggleRevisit={toggleRevisitLater} />)}
        {visibleProjects.length === 0 && (
          <ArchiveEmptyState
            filtered={hasFilters && projects.length > 0}
            title={hasFilters && projects.length > 0 ? "No projects match those filters" : emptyTitle}
            description={hasFilters && projects.length > 0 ? "Try a broader search or reset the active filters." : emptyDescription}
            onReset={() => setFilters({ ...defaultArchiveFilters })}
          />
        )}
      </section>
    </>
  );
}
