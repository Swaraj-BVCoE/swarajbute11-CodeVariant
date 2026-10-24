import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { ArchiveGrid } from "../features/archive/ArchiveGrid";
import { useArchive } from "../features/archive/ArchiveContext";

export function RevivedProjectsPage() {
  const { projects } = useArchive();
  const revivedProjects = projects.filter((project) => project.status === "reviving");
  return <><PageHeader eyebrow="Back in motion" title="Revived projects" description="Projects given a new direction, a smaller shape, or one honest next action." /><PageContainer><ArchiveGrid projects={revivedProjects} showStatusFilter={false} emptyTitle="No projects are reviving yet" emptyDescription="The reflection journey in Checkpoint 4 will help an idea find its way here." /></PageContainer></>;
}
