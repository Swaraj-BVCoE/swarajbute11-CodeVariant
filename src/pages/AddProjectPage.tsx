import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function AddProjectPage() {
  return <><PageHeader eyebrow="Preserve the context" title="Add a sleeping project" description="Record the idea, the progress, and the precise point where momentum faded." /><PageContainer><PlaceholderPanel checkpoint={3} title="The project form is mapped and ready" description="A focused three-step flow will collect the original idea, where you stopped, and why it paused. This checkpoint establishes the route and shell only." /></PageContainer></>;
}
