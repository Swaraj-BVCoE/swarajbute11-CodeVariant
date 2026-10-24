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
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-[#E6E4DD] bg-[#FFFFFF] p-0 text-[#252724] shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-xs"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-10 place-items-center rounded-xl bg-rose-50 text-rose-600">
            <Trash2 className="size-5" />
          </span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#858780] hover:bg-[#F3F2EE] hover:text-[#252724]"
            aria-label="Close delete dialog"
          >
            <X className="size-4" />
          </button>
        </div>
        <h2 className="mt-4 font-display text-2xl font-medium text-[#252724]">Delete “{projectName}”?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5C605A]">
          The project, its Memory Capsule, timeline, and all recorded notes will be removed from this browser. This action cannot be undone.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Keep project
          </Button>
          <Button type="button" className="bg-[#9E2A2B] text-white hover:bg-[#802223]" onClick={onConfirm}>
            <Trash2 className="size-4" /> Delete permanently
          </Button>
        </div>
      </div>
    </dialog>
  );
}

export function ProjectDetailsPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { projects, deleteProject } = useArchive();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const project = projects.find((candidate) => candidate.id === projectId);

  if (!project) {
    return (
      <>
        <PageHeader eyebrow="Project memory" title="Project not found" description="This project may have been removed from the local archive." />
        <PageContainer>
          <Button asChild variant="secondary">
            <Link to="/"><ArrowLeft className="size-4" /> Back to archive</Link>
          </Button>
        </PageContainer>
      </>
    );
  }

  const completed = project.workItems.filter((item) => item.completed);
  const unfinished = project.workItems.filter((item) => !item.completed);
  const capsule = project.memoryCapsule;
  const hasCapsule = capsule && (capsule.lastThingThatWorked || capsule.exactStoppingPoint || capsule.suggestedNextStep || capsule.noteToFutureSelf || capsule.importantLinks.length > 0);

  const confirmDelete = () => {
    if (!deleteProject(project.id)) return;
    setDeleteOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      <PageHeader
        eyebrow="Project memory"
        title={project.name}
        description={project.shortDescription}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="lg"
              className="text-[#9E2A2B] hover:bg-rose-50 hover:text-[#9E2A2B]"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="size-4" /> Delete
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to={`/projects/${project.id}/edit`}>
                <Pencil className="size-4" /> Edit project
              </Link>
            </Button>
          </div>
        }
      />

      <PageContainer>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <StatusBadge status={project.status} />
          {project.technologies.map((technology) => (
            <Badge key={technology}>{technology}</Badge>
          ))}
          {project.revisitLater && (
            <Badge variant="amber">
              <Clock3 className="size-3" /> Revisit saved
            </Badge>
          )}
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.28fr)_minmax(21rem,0.72fr)]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#606E54]">
                  Original Intention
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium text-[#252724]">
                  What this project was meant to be
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-[0.96rem] leading-relaxed text-[#5C605A]">
                  {project.intendedOutcome}
                </p>
                {(project.repositoryUrl || project.demoUrl) && (
                  <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-[#F3F2EE]">
                    {project.repositoryUrl && (
                      <Button asChild variant="secondary" size="sm">
                        <a href={project.repositoryUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3.5" /> Repository
                        </a>
                      </Button>
                    )}
                    {project.demoUrl && (
                      <Button asChild variant="secondary" size="sm">
                        <a href={project.demoUrl} target="_blank" rel="noreferrer">
                          <ExternalLink className="size-3.5" /> Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#858780]">
                  Progress Snapshot
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium text-[#252724]">
                  Where the work stopped
                </h2>
              </CardHeader>
              <CardContent className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] p-4.5">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#606E54]">
                    <CheckCircle2 className="size-4" /> Completed ({completed.length})
                  </p>
                  <ul className="space-y-2 text-sm text-[#5C605A]">
                    {completed.length ? (
                      completed.map((item) => <li key={item.id} className="flex items-start gap-2"><span className="text-[#606E54] mt-1">•</span><span>{item.text}</span></li>)
                    ) : (
                      <li className="text-[#858780]">Nothing recorded yet.</li>
                    )}
                  </ul>
                </div>
                <div className="rounded-xl bg-[#FAF9F6] border border-[#E6E4DD] p-4.5">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-[#9E7D4E]">
                    <Circle className="size-4" /> Still unfinished ({unfinished.length})
                  </p>
                  <ul className="space-y-2 text-sm text-[#5C605A]">
                    {unfinished.length ? (
                      unfinished.map((item) => <li key={item.id} className="flex items-start gap-2"><span className="text-[#9E7D4E] mt-1">•</span><span>{item.text}</span></li>)
                    ) : (
                      <li className="text-[#858780]">Nothing recorded yet.</li>
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#606E54]">
                  <MemoryStick className="size-3.5" /> Project Memory Capsule
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium text-[#252724]">
                  Where you left off
                </h2>
              </CardHeader>
              <CardContent>
                {hasCapsule ? (
                  <div className="grid gap-5 sm:grid-cols-2">
                    {capsule.lastThingThatWorked && (
                      <div className="rounded-lg bg-[#FAF9F6] p-4 border border-[#E6E4DD]">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#858780]">
                          Last thing that worked
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#252724]">
                          {capsule.lastThingThatWorked}
                        </p>
                      </div>
                    )}
                    {capsule.exactStoppingPoint && (
                      <div className="rounded-lg bg-[#FAF9F6] p-4 border border-[#E6E4DD]">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#858780]">
                          Exact stopping point
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#252724]">
                          {capsule.exactStoppingPoint}
                        </p>
                      </div>
                    )}
                    {capsule.suggestedNextStep && (
                      <div className="rounded-lg bg-[#FAF9F6] p-4 border border-[#E6E4DD]">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#858780]">
                          Suggested next step
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-[#252724]">
                          {capsule.suggestedNextStep}
                        </p>
                      </div>
                    )}
                    {capsule.noteToFutureSelf && (
                      <div className="rounded-lg bg-[#FAF9F6] p-4 border border-[#E6E4DD]">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#858780]">
                          Note to future self
                        </p>
                        <p className="mt-1.5 text-sm italic leading-relaxed text-[#252724]">
                          “{capsule.noteToFutureSelf}”
                        </p>
                      </div>
                    )}
                    {capsule.importantLinks.length > 0 && (
                      <div className="sm:col-span-2 pt-2">
                        <p className="text-[0.68rem] font-semibold uppercase tracking-wider text-[#858780]">
                          Important references
                        </p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {capsule.importantLinks.map((link) => (
                            <Button key={link} asChild variant="secondary" size="sm">
                              <a href={link} target="_blank" rel="noreferrer">
                                <ExternalLink className="size-3.5" /> {link.replace(/^https?:\/\//, "").slice(0, 32)}…
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-sm leading-relaxed text-[#858780]">
                    No Memory Capsule details were recorded. Edit this project to leave your future self a useful handoff.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#9E7D4E]">
                  Why it paused
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium text-[#252724]">
                  {abandonmentReasonLabels[project.abandonmentReason]}
                </h2>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-[#5C605A]">
                  {project.abandonmentNotes ?? "No supporting notes were recorded."}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="space-y-3.5 p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#858780]">Started</span>
                  <span className="text-sm font-medium text-[#252724]">{formatDate(project.startDate)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-[#858780]">Last worked</span>
                  <span className="text-sm font-medium text-[#252724]">{formatDate(project.lastWorkedDate)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-[#F3F2EE] pt-3.5">
                  <span className="flex items-center gap-1.5 text-xs text-[#858780]">
                    <Archive className="size-3.5" /> Preserved in archive
                  </span>
                  <span className="text-sm font-medium text-[#252724]">{formatDate(project.createdAt)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <p className="flex items-center gap-1.5 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#606E54]">
                  <Sparkles className="size-3.5" /> Project History
                </p>
                <h2 className="mt-1 font-display text-2xl font-medium text-[#252724]">
                  Timeline
                </h2>
              </CardHeader>
              <CardContent>
                <ol className="relative space-y-5 border-l border-[#E6E4DD] pl-5">
                  {[...project.timeline].reverse().map((event) => (
                    <li key={event.id} className="relative">
                      <span className="absolute -left-[1.45rem] top-1.5 size-2 rounded-full bg-[#606E54] ring-4 ring-white" />
                      <p className="text-sm font-semibold text-[#252724]">{event.title}</p>
                      {event.description && (
                        <p className="mt-0.5 text-xs leading-relaxed text-[#5C605A]">{event.description}</p>
                      )}
                      <time className="mt-1 block text-[0.7rem] text-[#858780]">
                        {formatDate(event.occurredAt, true)}
                      </time>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button asChild variant="ghost" className="mt-8">
          <Link to="/">
            <ArrowLeft className="size-4" /> Back to archive
          </Link>
        </Button>
      </PageContainer>

      <DeleteProjectDialog
        open={deleteOpen}
        projectName={project.name}
        onClose={() => setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
}
