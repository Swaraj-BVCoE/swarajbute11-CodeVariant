import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { ArchiveGrid } from "../features/archive/ArchiveGrid";
import { useArchive } from "../features/archive/ArchiveContext";

export function ArchivedProjectsPage() {
  const { projects } = useArchive();
  const archivedProjects = projects.filter((project) => project.status === "archived");
  return <><PageHeader eyebrow="Rest without regret" title="Archived projects" description="Ideas you chose not to pursue, preserved as useful history rather than erased." /><PageContainer><ArchiveGrid projects={archivedProjects} showStatusFilter={false} emptyTitle="The long-term archive is empty" emptyDescription="Choosing to archive a project later will preserve it here without asking for action." /></PageContainer></>;
}
