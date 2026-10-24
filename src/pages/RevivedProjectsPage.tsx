import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function RevivedProjectsPage() {
  return <><PageHeader eyebrow="Back in motion" title="Revived projects" description="Projects given a new direction, a smaller shape, or one honest next action." /><PageContainer><PlaceholderPanel checkpoint={4} title="Revival decisions will gather here" description="Restarted, continued, changed, and repurposed projects will appear automatically after the reflection journey is implemented." /></PageContainer></>;
}
