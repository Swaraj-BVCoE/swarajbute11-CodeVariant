import { useMemo, useState } from "react";
import type { Project } from "../../domain/project";
import { useArchive } from "./ArchiveContext";
import { ArchiveEmptyState } from "./ArchiveEmptyState";
import { ArchiveToolbar } from "./ArchiveToolbar";
import { ProjectCard } from "./ProjectCard";
import { defaultArchiveFilters, filterAndSortProjects } from "./projectFilters";
import { ActionZone } from "../canvas-protocol/ActionZone";
import { CanvasBoard } from "../canvas-protocol/CanvasBoard";
import { CanvasGuide } from "../canvas-protocol/CanvasGuide";
import type { CanvasCardData, CanvasZoneData } from "../canvas-protocol/canvasProtocol";

type ArchiveGridProps = {
  projects: Project[];
  emptyTitle: string;
  emptyDescription: string;
  showStatusFilter?: boolean;
  revisitAction?: "add" | "remove";
};

export function ArchiveGrid({ projects, emptyTitle, emptyDescription, showStatusFilter = true, revisitAction = "add" }: ArchiveGridProps) {
  const [filters, setFilters] = useState({ ...defaultArchiveFilters });
  const { toggleRevisitLater } = useArchive();
  const visibleProjects = useMemo(() => filterAndSortProjects(projects, filters), [projects, filters]);
  const hasFilters = Boolean(filters.query || filters.status !== "all" || filters.reason !== "all" || filters.sort !== "recent-activity");

  const handleDrop = (card: CanvasCardData, zone: CanvasZoneData) => {
    if (!card.projectId) return false;
    const currentProject = projects.find((project) => project.id === card.projectId);
    if (!currentProject) return false;
    if (zone.zoneType === "revisit-later") {
      if (currentProject.revisitLater) return false;
      return toggleRevisitLater(currentProject.id, true);
    }
    if (zone.zoneType === "return-to-collection") {
      if (!currentProject.revisitLater) return false;
      return toggleRevisitLater(currentProject.id, false);
    }
    return false;
  };

  return (
    <CanvasBoard onDrop={handleDrop}>
      <CanvasGuide />
      <ArchiveToolbar filters={filters} onChange={setFilters} showStatus={showStatusFilter} />
      <div className="mt-4 flex items-center justify-between gap-4 px-1">
        <p className="text-xs text-[#858780]">
          Showing <strong className="font-semibold text-[#252724]">{visibleProjects.length}</strong> {visibleProjects.length === 1 ? "project" : "projects"}
        </p>
        <p className="hidden text-xs text-[#858780] sm:block">All changes saved automatically</p>
      </div>
      <div className="mt-3">
        <ActionZone
          data={{
            kind: "action-zone",
            zoneType: revisitAction === "add" ? "revisit-later" : "return-to-collection",
            label: revisitAction === "add" ? "Revisit Later" : "Return to Collection",
          }}
          instruction={revisitAction === "add"
            ? "Drop a project card here to set it aside for reflection."
            : "Drop a project card here to remove it from the revisit list."}
        />
      </div>
      <section className="mt-3 grid gap-5 md:grid-cols-2 2xl:grid-cols-3" aria-label="Projects">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
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
    </CanvasBoard>
  );
}
