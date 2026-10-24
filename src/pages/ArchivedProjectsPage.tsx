import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function ArchivedProjectsPage() {
  return <><PageHeader eyebrow="Rest without regret" title="Archived projects" description="Ideas you chose not to pursue, preserved as useful history rather than erased." /><PageContainer><PlaceholderPanel checkpoint={2} title="The long-term archive is prepared" description="Archived status, filtering, and restoration pathways will connect to browser-local project data in later checkpoints." /></PageContainer></>;
}
