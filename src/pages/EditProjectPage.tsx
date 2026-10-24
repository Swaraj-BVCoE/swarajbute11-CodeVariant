import { useParams } from "react-router-dom";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function EditProjectPage() {
  const { projectId } = useParams();
  return <><PageHeader eyebrow="Update the record" title="Edit project" description="Refine the saved context without losing the history that made it meaningful." /><PageContainer><PlaceholderPanel checkpoint={3} title="Editing arrives with the complete form journey" description={`This route is ready for project “${projectId ?? "unknown"}”. Existing values, validation, draft protection, and history-preserving edits will be added in Checkpoint 3.`} /></PageContainer></>;
}
