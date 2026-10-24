import { useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { PlaceholderPanel } from "../components/PlaceholderPanel";
import { Badge } from "../components/ui/Badge";

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  return <><PageHeader eyebrow="Project memory" title="Project details" description="A single place to recover what the project was, where it stopped, and what it could become." /><PageContainer><PlaceholderPanel checkpoint={3} title="The full project story will live here" description="Memory Capsule, work completed, unfinished work, blocker history, timeline, and revival decisions will build on this route."><Badge variant="neutral" className="mt-5">Route ID: {projectId}</Badge></PlaceholderPanel></PageContainer></>;
}
