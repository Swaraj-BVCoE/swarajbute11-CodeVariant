import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { ArchiveGrid } from "../features/archive/ArchiveGrid";
import { useArchive } from "../features/archive/ArchiveContext";

export function RevisitLaterPage() {
  const { projects } = useArchive();
  const revisitProjects = projects.filter((project) => project.revisitLater);
  return <><PageHeader eyebrow="A quiet reminder" title="Revisit later" description="Ideas you intentionally set aside—kept visible without demanding attention today." /><PageContainer><ArchiveGrid projects={revisitProjects} emptyTitle="Nothing is waiting on you" emptyDescription="Use the bookmark on any project card when you want to return to it later." /></PageContainer></>;
}
