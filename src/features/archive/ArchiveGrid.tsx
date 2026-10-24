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
      <div className="mt-4 flex items-center justify-between gap-4 px-1">
        <p className="text-xs text-[#858780]">
          Showing <strong className="font-semibold text-[#252724]">{visibleProjects.length}</strong> {visibleProjects.length === 1 ? "project" : "projects"}
        </p>
        <p className="hidden text-xs text-[#858780] sm:block">All changes saved automatically</p>
      </div>
      <section className="mt-3 grid gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-label="Projects">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onToggleRevisit={toggleRevisitLater} />
        ))}
        {visibleProjects.length === 0 && (
          <ArchiveEmptyState
            filtered={hasFilters && projects.length > 0}
            title={hasFilters && projects.length > 0 ? "No projects match those filters" : emptyTitle}
            description={hasFilters && projects.length > 0 ? "Try a broader search query or reset your filter selection." : emptyDescription}
            onReset={() => setFilters({ ...defaultArchiveFilters })}
          />
        )}
      </section>
    </>
  );
}
