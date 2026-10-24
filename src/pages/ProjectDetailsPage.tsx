import { Archive, ArrowLeft, CheckCircle2, Circle, Clock3, ExternalLink, MemoryStick, Pencil, Sparkles, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { abandonmentReasonLabels } from "../domain/project";
import { useArchive } from "../features/archive/ArchiveContext";
import { StatusBadge } from "../features/archive/StatusBadge";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader } from "../components/ui/Card";

function formatDate(value?: string, includeTime = false) {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat("en", includeTime ? { dateStyle: "medium", timeStyle: "short" } : { day: "numeric", month: "long", year: "numeric" }).format(new Date(value));
}

function DeleteProjectDialog({ open, projectName, onClose, onConfirm }: { open: boolean; projectName: string; onClose: () => void; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; if (!dialog) return; if (open && !dialog.open) dialog.showModal(); if (!open && dialog.open) dialog.close(); }, [open]);
  return <dialog ref={ref} onClose={onClose} className="m-auto w-[min(92vw,31rem)] rounded-2xl border border-white/10 bg-[#101521] p-0 text-slate-100 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm"><div className="p-6 sm:p-7"><div className="flex items-start justify-between gap-4"><span className="grid size-11 place-items-center rounded-xl bg-rose-400/10 text-rose-300"><Trash2 className="size-5" /></span><button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-white/[0.06] hover:text-white" aria-label="Close delete dialog"><X className="size-4" /></button></div><h2 className="mt-5 font-display text-2xl font-bold text-white">Delete “{projectName}”?</h2><p className="mt-2 text-sm leading-6 text-slate-400">The project, Memory Capsule, timeline, and all related history will be removed from this browser. This cannot be undone.</p><div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button type="button" variant="secondary" onClick={onClose}>Keep project</Button><Button type="button" className="bg-rose-500 hover:bg-rose-400" onClick={onConfirm}><Trash2 className="size-4" /> Delete permanently</Button></div></div></dialog>;
}

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, deleteProject } = useArchive();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const project = projects.find((candidate) => candidate.id === projectId);

  if (!project) return <><PageHeader eyebrow="Project memory" title="Project not found" description="This project may have been removed from the local archive." /><PageContainer><Button asChild variant="secondary"><Link to="/"><ArrowLeft className="size-4" /> Back to archive</Link></Button></PageContainer></>;

  const completed = project.workItems.filter((item) => item.completed);
  const unfinished = project.workItems.filter((item) => !item.completed);
  const capsule = project.memoryCapsule;
  const hasCapsule = capsule && (capsule.lastThingThatWorked || capsule.exactStoppingPoint || capsule.suggestedNextStep || capsule.noteToFutureSelf || capsule.importantLinks.length);

  const confirmDelete = () => {
    if (!deleteProject(project.id)) return;
    setDeleteOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <PageHeader eyebrow="Project memory" title={project.name} description={project.shortDescription} action={<div className="flex flex-wrap gap-2"><Button type="button" variant="ghost" size="lg" className="text-rose-300 hover:text-rose-200" onClick={() => setDeleteOpen(true)}><Trash2 className="size-4" /> Delete</Button><Button asChild variant="secondary" size="lg"><Link to={`/projects/${project.id}/edit`}><Pencil className="size-4" /> Edit project</Link></Button></div>} />
      <PageContainer>
        <div className="mb-5 flex flex-wrap items-center gap-2"><StatusBadge status={project.status} />{project.technologies.map((technology) => <Badge key={technology}>{technology}</Badge>)}{project.revisitLater && <Badge variant="amber"><Clock3 className="size-3" /> Revisit saved</Badge>}</div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_minmax(21rem,.75fr)]">
          <div className="space-y-5">
            <Card><CardHeader><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">Original intention</p><h2 className="mt-2 font-display text-xl font-bold text-white">What this project wanted to become</h2></CardHeader><CardContent><p className="leading-7 text-slate-300">{project.intendedOutcome}</p>{(project.repositoryUrl || project.demoUrl) && <div className="mt-5 flex flex-wrap gap-2">{project.repositoryUrl && <Button asChild variant="secondary" size="sm"><a href={project.repositoryUrl} target="_blank" rel="noreferrer"><ExternalLink className="size-3.5" /> Repository</a></Button>}{project.demoUrl && <Button asChild variant="secondary" size="sm"><a href={project.demoUrl} target="_blank" rel="noreferrer"><ExternalLink className="size-3.5" /> Demo</a></Button>}</div>}</CardContent></Card>
            <Card><CardHeader><p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Progress snapshot</p><h2 className="mt-2 font-display text-xl font-bold text-white">Where the work stands</h2></CardHeader><CardContent className="grid gap-6 sm:grid-cols-2"><div><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-emerald-200"><CheckCircle2 className="size-4" /> Completed ({completed.length})</p><ul className="space-y-2 text-sm text-slate-400">{completed.length ? completed.map((item) => <li key={item.id}>{item.text}</li>) : <li>Nothing recorded yet.</li>}</ul></div><div><p className="mb-3 flex items-center gap-2 text-sm font-semibold text-violet-200"><Circle className="size-4" /> Still unfinished ({unfinished.length})</p><ul className="space-y-2 text-sm text-slate-400">{unfinished.length ? unfinished.map((item) => <li key={item.id}>{item.text}</li>) : <li>Nothing recorded yet.</li>}</ul></div></CardContent></Card>
            <Card><CardHeader><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-300"><MemoryStick className="size-4" /> Project Memory Capsule</p><h2 className="mt-2 font-display text-xl font-bold text-white">Where you left off</h2></CardHeader><CardContent>{hasCapsule ? <div className="grid gap-5 sm:grid-cols-2">{capsule.lastThingThatWorked && <div><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Last thing that worked</p><p className="mt-2 text-sm leading-6 text-slate-300">{capsule.lastThingThatWorked}</p></div>}{capsule.exactStoppingPoint && <div><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Exact stopping point</p><p className="mt-2 text-sm leading-6 text-slate-300">{capsule.exactStoppingPoint}</p></div>}{capsule.suggestedNextStep && <div><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Suggested next step</p><p className="mt-2 text-sm leading-6 text-slate-300">{capsule.suggestedNextStep}</p></div>}{capsule.noteToFutureSelf && <div><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Note to future self</p><p className="mt-2 text-sm italic leading-6 text-slate-300">“{capsule.noteToFutureSelf}”</p></div>}{capsule.importantLinks.length > 0 && <div className="sm:col-span-2"><p className="text-xs font-bold uppercase tracking-wider text-slate-600">Important links</p><div className="mt-2 flex flex-wrap gap-2">{capsule.importantLinks.map((link) => <Button key={link} asChild variant="secondary" size="sm"><a href={link} target="_blank" rel="noreferrer"><ExternalLink className="size-3.5" /> Open link</a></Button>)}</div></div>}</div> : <p className="text-sm leading-6 text-slate-500">No Memory Capsule details were recorded. Edit this project to leave your future self a useful handoff.</p>}</CardContent></Card>
          </div>
          <div className="space-y-5">
            <Card><CardHeader><p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-300">Why it paused</p><h2 className="mt-2 font-display text-xl font-bold text-white">{abandonmentReasonLabels[project.abandonmentReason]}</h2></CardHeader><CardContent><p className="text-sm leading-6 text-slate-400">{project.abandonmentNotes ?? "No supporting notes were recorded."}</p></CardContent></Card>
            <Card><CardContent className="space-y-4"><div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-500">Started</span><span className="text-sm font-medium text-slate-300">{formatDate(project.startDate)}</span></div><div className="flex items-center justify-between gap-4"><span className="text-sm text-slate-500">Last worked</span><span className="text-sm font-medium text-slate-300">{formatDate(project.lastWorkedDate)}</span></div><div className="flex items-center justify-between gap-4 border-t border-white/[0.07] pt-4"><span className="flex items-center gap-2 text-sm text-slate-500"><Archive className="size-4" /> Preserved</span><span className="text-sm font-medium text-slate-300">{formatDate(project.createdAt)}</span></div></CardContent></Card>
            <Card><CardHeader><p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-300"><Sparkles className="size-4" /> Project history</p><h2 className="mt-2 font-display text-xl font-bold text-white">Timeline</h2></CardHeader><CardContent><ol className="relative space-y-5 border-l border-white/10 pl-5">{[...project.timeline].reverse().map((event) => <li key={event.id} className="relative"><span className="absolute -left-[1.45rem] top-1.5 size-2 rounded-full bg-violet-300 ring-4 ring-[#0f1420]" /><p className="text-sm font-semibold text-slate-200">{event.title}</p>{event.description && <p className="mt-1 text-xs leading-5 text-slate-500">{event.description}</p>}<time className="mt-1 block text-[0.68rem] text-slate-600">{formatDate(event.occurredAt, true)}</time></li>)}</ol></CardContent></Card>
          </div>
        </div>
        <Button asChild variant="ghost" className="mt-6"><Link to="/"><ArrowLeft className="size-4" /> Back to archive</Link></Button>
      </PageContainer>
      <DeleteProjectDialog open={deleteOpen} projectName={project.name} onClose={() => setDeleteOpen(false)} onConfirm={confirmDelete} />
    </>
  );
}
