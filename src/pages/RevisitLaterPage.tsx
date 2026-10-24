import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { PlaceholderPanel } from "../components/PlaceholderPanel";

export function RevisitLaterPage() {
  return <><PageHeader eyebrow="A quiet reminder" title="Revisit later" description="Ideas you intentionally set aside—kept visible without demanding attention today." /><PageContainer><PlaceholderPanel checkpoint={2} title="Your reflection queue will appear here" description="This view will be derived from real guest data, with search, filters, and a quick way back into each project’s story." /></PageContainer></>;
}
