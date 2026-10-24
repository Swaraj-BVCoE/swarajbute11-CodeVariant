import { ArrowLeft, CheckCircle2, Circle, Clock3, Pencil } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { abandonmentReasonLabels } from "../domain/project";
import { useArchive } from "../features/archive/ArchiveContext";
import { StatusBadge } from "../features/archive/StatusBadge";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

function formatDate(value?: string) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const { projects } = useArchive();
  const project = projects.find((candidate) => candidate.id === projectId);

  if (!project) {
    return <><PageHeader eyebrow="Project memory" title="Project not found" description="This project may have been removed from the local archive." /><PageContainer><Button asChild variant="secondary"><Link to="/"><ArrowLeft className="size-4" /> Back to archive</Link></Button></PageContainer></>;
  }

  const completed = project.workItems.filter((item) => item.completed);
  const unfinished = project.workItems.filter((item) => !item.completed);

  return (
    <>
      <PageHeader eyebrow="Archive snapshot" title={project.name} description={project.shortDescription} action={<Button asChild variant="secondary"><Link to={`/projects/${project.id}/edit`}><Pencil className="size-4" /> Edit in Checkpoint 3</Link></Button>} />
      <PageContainer>
        <div className="mb-5 flex flex-wrap items-center gap-2"><StatusBadge status={project.status} />{project.technologies.map((technology) => <Badge key={technology}>{technology}</Badge>)}</div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.3fr)_minmax(20rem,.7fr)]">
          <div className="space-y-5">
            <Card><CardHeader><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Original intention</p><h2 className="mt-2 font-display text-xl font-bold text-white">What this project wanted to become</h2></CardHeader><CardContent><p className="leading-7 text-slate-300">{project.intendedOutcome}</p></CardContent></Card>
            <Card><CardHeader><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Progress snapshot</p><h2 className="mt-2 font-display text-xl font-bold text-white">Where the work stands</h2></CardHeader><CardContent className="grid gap-6 sm:grid-cols-2"><div><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200"><CheckCircle2 className="size-4" /> Completed</p><ul className="space-y-2 text-sm text-slate-400">{completed.map((item) => <li key={item.id}>{item.text}</li>)}</ul></div><div><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-200"><Circle className="size-4" /> Still unfinished</p><ul className="space-y-2 text-sm text-slate-400">{unfinished.map((item) => <li key={item.id}>{item.text}</li>)}</ul></div></CardContent></Card>
          </div>
          <div className="space-y-5">
            <Card><CardHeader><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Why it paused</p><h2 className="mt-2 font-display text-xl font-bold text-white">{abandonmentReasonLabels[project.abandonmentReason]}</h2></CardHeader><CardContent><p className="text-sm leading-6 text-slate-400">{project.abandonmentNotes ?? "No supporting notes were recorded."}</p></CardContent></Card>
            <Card><CardContent className="space-y-4"><div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-500">Started</span><span className="text-sm font-medium text-slate-300">{formatDate(project.startDate)}</span></div><div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-500">Last worked</span><span className="text-sm font-medium text-slate-300">{formatDate(project.lastWorkedDate)}</span></div><div className="flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4"><span className="flex items-center gap-2 text-sm text-slate-500"><Clock3 className="size-4" /> Archive activity</span><span className="text-sm font-medium text-slate-300">{formatDate(project.updatedAt)}</span></div></CardContent></Card>
          </div>
        </div>
        <Button asChild variant="ghost" className="mt-6"><Link to="/"><ArrowLeft className="size-4" /> Back to archive</Link></Button>
      </PageContainer>
    </>
  );
}
