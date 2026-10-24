import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, Link2, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch, type FieldErrors, type FieldPath } from "react-hook-form";
import { Link } from "react-router-dom";
import { abandonmentReasonLabels, abandonmentReasons, projectStatuses, statusLabels } from "../../domain/project";
import { cn } from "../../lib/utils";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { Textarea } from "../../components/ui/Textarea";
import { clearProjectDraft, loadProjectDraft, saveProjectDraft, type ProjectDraft } from "./projectDraft";
import { createStableId } from "./projectMapping";
import { projectFormSchema, type ProjectFormValues } from "./projectFormSchema";
import { useDirtyNavigationGuard } from "./useDirtyNavigationGuard";

type ProjectFormProps = {
  mode: "create" | "edit";
  initialValues: ProjectFormValues;
  cancelTo: string;
  onSubmitProject: (values: ProjectFormValues) => boolean;
};

const steps = [
  { number: 1, label: "Original idea", note: "What you wanted to make" },
  { number: 2, label: "Where you stopped", note: "Progress and present state" },
  { number: 3, label: "Why it paused", note: "Blocker and memory capsule" },
];

const stepFields: Record<number, FieldPath<ProjectFormValues>[]> = {
  1: ["name", "shortDescription", "intendedOutcome", "technologies", "repositoryUrl", "demoUrl"],
  2: ["workItems", "status", "startDate", "lastWorkedDate"],
  3: ["abandonmentReason", "abandonmentNotes", "memoryCapsule"],
};

function Field({ label, hint, error, required, children }: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-200"><span>{label}{required && <span className="ml-1 text-violet-300">*</span>}</span>{hint && <span className="text-xs font-normal text-slate-600">{hint}</span>}</span>{children}{error && <span className="mt-1.5 block text-xs text-rose-300" role="alert">{error}</span>}</label>;
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className="mb-7"><p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">{eyebrow}</p><h2 className="mt-2 font-display text-2xl font-bold text-white">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">{description}</p></div>;
}

export function ProjectForm({ mode, initialValues, cancelTo, onSubmitProject }: ProjectFormProps) {
  const draftLoad = useMemo(() => mode === "create" ? loadProjectDraft() : { ok: true as const, data: null }, [mode]);
  const [pendingDraft, setPendingDraft] = useState<ProjectDraft | null>(draftLoad.ok ? draftLoad.data : null);
  const [draftIssue, setDraftIssue] = useState(draftLoad.ok ? "" : draftLoad.message);
  const [draftMessage, setDraftMessage] = useState("");
  const [restoredDraft, setRestoredDraft] = useState(false);
  const [saved, setSaved] = useState(false);
  const [step, setStep] = useState(1);
  const [technologyInput, setTechnologyInput] = useState("");
  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    setValue,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<ProjectFormValues>({ resolver: zodResolver(projectFormSchema), defaultValues: initialValues, mode: "onTouched" });

  const workItems = useFieldArray({ control, name: "workItems", keyName: "fieldKey" });
  const importantLinks = useFieldArray({ control, name: "memoryCapsule.importantLinks", keyName: "fieldKey" });
  const observedValues = useWatch({ control });
  const technologies = observedValues.technologies ?? [];
  useDirtyNavigationGuard((isDirty || restoredDraft) && !saved);

  useEffect(() => {
    if (mode !== "create" || pendingDraft || (!isDirty && !restoredDraft) || saved) return;
    const timer = setTimeout(() => {
      const result = saveProjectDraft(observedValues as ProjectFormValues);
      setDraftMessage(result.ok ? "Draft saved in this browser" : result.message);
    }, 450);
    return () => clearTimeout(timer);
  }, [isDirty, mode, observedValues, pendingDraft, restoredDraft, saved]);

  const restoreDraft = () => {
    if (!pendingDraft) return;
    reset(pendingDraft.values);
    setPendingDraft(null);
    setRestoredDraft(true);
    setDraftMessage("Draft restored — review it before preserving the project");
  };

  const discardDraft = () => {
    const result = clearProjectDraft();
    setPendingDraft(null);
    setDraftIssue(result.ok ? "" : result.message);
  };

  const addTechnology = () => {
    const value = technologyInput.trim();
    if (!value || technologies.some((item) => item.toLocaleLowerCase() === value.toLocaleLowerCase())) return;
    setValue("technologies", [...technologies, value], { shouldDirty: true, shouldValidate: true });
    setTechnologyInput("");
  };

  const nextStep = async () => {
    const valid = await trigger(stepFields[step], { shouldFocus: true });
    if (valid) setStep((current) => Math.min(3, current + 1));
  };

  const handleValidSubmit = (values: ProjectFormValues) => {
    if (!onSubmitProject(values)) return;
    setSaved(true);
    if (mode === "create") clearProjectDraft();
  };

  const handleInvalidSubmit = (formErrors: FieldErrors<ProjectFormValues>) => {
    if (formErrors.name || formErrors.shortDescription || formErrors.intendedOutcome || formErrors.technologies || formErrors.repositoryUrl || formErrors.demoUrl) setStep(1);
    else if (formErrors.workItems || formErrors.status || formErrors.startDate || formErrors.lastWorkedDate) setStep(2);
    else setStep(3);
  };

  const today = new Date().toISOString().slice(0, 10);
  const completedCount = workItems.fields.filter((item) => item.completed).length;
  const unfinishedCount = workItems.fields.length - completedCount;

  return (
    <form onSubmit={handleSubmit(handleValidSubmit, handleInvalidSubmit)} noValidate>
      {(pendingDraft || draftIssue) && (
        <div className="mb-5 flex flex-col gap-4 rounded-2xl border border-amber-300/15 bg-amber-400/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div><p className="font-semibold text-amber-100">{pendingDraft ? "A saved draft is waiting" : "Draft recovery needs attention"}</p><p className="mt-1 text-sm text-slate-400">{pendingDraft ? `Last saved ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(pendingDraft.updatedAt))}.` : draftIssue}</p></div>
          <div className="flex gap-2">{pendingDraft && <Button type="button" size="sm" onClick={restoreDraft}>Restore draft</Button>}<Button type="button" variant="secondary" size="sm" onClick={discardDraft}>Discard</Button></div>
        </div>
      )}

      <div className="mb-5 grid gap-2 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-2 sm:grid-cols-3">
        {steps.map((item) => <button key={item.number} type="button" onClick={() => item.number < step && setStep(item.number)} className={cn("flex items-center gap-3 rounded-xl px-3 py-3 text-left transition", step === item.number ? "bg-violet-400/10 ring-1 ring-inset ring-violet-300/15" : item.number < step ? "hover:bg-white/[0.04]" : "opacity-50")}><span className={cn("grid size-8 shrink-0 place-items-center rounded-full border text-xs font-bold", step === item.number ? "border-violet-300/30 bg-violet-400/15 text-violet-100" : item.number < step ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-200" : "border-white/10 text-slate-500")}>{item.number < step ? <Check className="size-4" /> : item.number}</span><span><span className="block text-sm font-semibold text-slate-200">{item.label}</span><span className="hidden text-xs text-slate-600 xl:block">{item.note}</span></span></button>)}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-5 sm:p-7 lg:p-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.18 }}>
              {step === 1 && <>
                <SectionIntro eyebrow="Step 1 of 3" title="Remember the original idea" description="Capture enough context that your future self can understand why this project mattered." />
                <div className="grid gap-5">
                  <Field label="Project name" required error={errors.name?.message}><Input {...register("name")} aria-invalid={Boolean(errors.name)} placeholder="e.g. Sunday Sketchbook" /></Field>
                  <Field label="Short description" required hint={`${observedValues.shortDescription?.length ?? 0}/240`} error={errors.shortDescription?.message}><Textarea {...register("shortDescription")} aria-invalid={Boolean(errors.shortDescription)} rows={3} placeholder="A one-sentence explanation of the project…" /></Field>
                  <Field label="What did you want to build?" required error={errors.intendedOutcome?.message}><Textarea {...register("intendedOutcome")} aria-invalid={Boolean(errors.intendedOutcome)} placeholder="Describe the original outcome or change you hoped to create…" /></Field>
                  <Field label="Technologies" hint="Press Enter to add" error={errors.technologies?.message}><div className="flex gap-2"><Input value={technologyInput} onChange={(event) => setTechnologyInput(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addTechnology(); } }} placeholder="React, Figma, Python…" /><Button type="button" variant="secondary" onClick={addTechnology}><Plus className="size-4" /> Add</Button></div><div className="mt-2 flex flex-wrap gap-2">{technologies.map((technology, index) => <Badge key={`${technology}-${index}`} variant="violet">{technology}<button type="button" aria-label={`Remove ${technology}`} onClick={() => setValue("technologies", technologies.filter((_, itemIndex) => itemIndex !== index), { shouldDirty: true, shouldValidate: true })}><X className="size-3" /></button></Badge>)}</div></Field>
                  <div className="grid gap-5 sm:grid-cols-2"><Field label="Repository URL" error={errors.repositoryUrl?.message}><Input {...register("repositoryUrl")} aria-invalid={Boolean(errors.repositoryUrl)} inputMode="url" placeholder="https://github.com/…" /></Field><Field label="Demo URL" error={errors.demoUrl?.message}><Input {...register("demoUrl")} aria-invalid={Boolean(errors.demoUrl)} inputMode="url" placeholder="https://…" /></Field></div>
                </div>
              </>}

              {step === 2 && <>
                <SectionIntro eyebrow="Step 2 of 3" title="Mark the exact stopping point" description="Separate what already exists from what still needs attention. This is a memory aid, not a task list." />
                <div className="grid gap-7 lg:grid-cols-2">
                  {([true, false] as const).map((completed) => <section key={String(completed)}><div className="mb-3 flex items-center justify-between"><p className={cn("flex items-center gap-2 text-sm font-semibold", completed ? "text-emerald-200" : "text-violet-200")}>{completed ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}{completed ? "Completed" : "Still unfinished"} <span className="text-slate-600">({completed ? completedCount : unfinishedCount})</span></p><Button type="button" variant="ghost" size="sm" onClick={() => workItems.append({ id: createStableId("work"), text: "", completed })}><Plus className="size-3.5" /> Add</Button></div><div className="space-y-2">{workItems.fields.map((field, index) => field.completed === completed && <div key={field.fieldKey}><div className="flex gap-2"><Input {...register(`workItems.${index}.text`)} aria-label={`${completed ? "Completed" : "Unfinished"} work item`} placeholder={completed ? "What already works?" : "What remains?"} /><Button type="button" variant="ghost" size="icon" onClick={() => workItems.remove(index)} aria-label="Remove work item"><Trash2 className="size-4" /></Button></div>{errors.workItems?.[index]?.text?.message && <p className="mt-1 text-xs text-rose-300">{errors.workItems[index]?.text?.message}</p>}</div>)}</div></section>)}
                </div>
                {typeof errors.workItems?.message === "string" && <p className="mt-2 text-xs text-rose-300">{errors.workItems.message}</p>}
                <div className="mt-8 grid gap-5 border-t border-white/[0.07] pt-7 sm:grid-cols-3">
                  <Field label="Current status" required error={errors.status?.message}><Select {...register("status")}>{projectStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</Select></Field>
                  <Field label="Started" error={errors.startDate?.message}><Input type="date" max={today} {...register("startDate")} /></Field>
                  <Field label="Last worked" error={errors.lastWorkedDate?.message}><Input type="date" max={today} {...register("lastWorkedDate")} /></Field>
                </div>
              </>}

              {step === 3 && <>
                <SectionIntro eyebrow="Step 3 of 3" title="Leave yourself a useful memory" description="Name the blocker honestly, then record the clues that would make returning easier." />
                <div className="grid gap-5 sm:grid-cols-2"><Field label="Why did work stop?" required error={errors.abandonmentReason?.message}><Select {...register("abandonmentReason")}>{abandonmentReasons.map((reason) => <option key={reason} value={reason}>{abandonmentReasonLabels[reason]}</option>)}</Select></Field><Field label="Supporting notes" error={errors.abandonmentNotes?.message}><Textarea {...register("abandonmentNotes")} rows={3} placeholder="What made this blocker matter at the time?" /></Field></div>
                <div className="my-8 flex items-center gap-3"><span className="h-px flex-1 bg-white/[0.07]" /><Badge variant="violet">Project Memory Capsule</Badge><span className="h-px flex-1 bg-white/[0.07]" /></div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <Field label="Last thing that worked" error={errors.memoryCapsule?.lastThingThatWorked?.message}><Textarea {...register("memoryCapsule.lastThingThatWorked")} rows={3} placeholder="What was working when you left?" /></Field>
                  <Field label="Exact stopping point" error={errors.memoryCapsule?.exactStoppingPoint?.message}><Textarea {...register("memoryCapsule.exactStoppingPoint")} rows={3} placeholder="The precise screen, bug, question, or decision…" /></Field>
                  <Field label="Suggested next step" error={errors.memoryCapsule?.suggestedNextStep?.message}><Textarea {...register("memoryCapsule.suggestedNextStep")} rows={3} placeholder="One small action that would restart momentum…" /></Field>
                  <Field label="Note to my future self" error={errors.memoryCapsule?.noteToFutureSelf?.message}><Textarea {...register("memoryCapsule.noteToFutureSelf")} rows={3} placeholder="What would you want to remember before returning?" /></Field>
                </div>
                <section className="mt-6"><div className="mb-3 flex items-center justify-between"><p className="flex items-center gap-2 text-sm font-semibold text-slate-200"><Link2 className="size-4 text-violet-300" /> Important links</p><Button type="button" variant="ghost" size="sm" onClick={() => importantLinks.append({ id: createStableId("link"), url: "" })}><Plus className="size-3.5" /> Add link</Button></div><div className="space-y-2">{importantLinks.fields.map((field, index) => <div key={field.fieldKey}><div className="flex gap-2"><Input {...register(`memoryCapsule.importantLinks.${index}.url`)} inputMode="url" aria-label="Important link" placeholder="https://…" /><Button type="button" variant="ghost" size="icon" onClick={() => importantLinks.remove(index)} aria-label="Remove important link"><Trash2 className="size-4" /></Button></div>{errors.memoryCapsule?.importantLinks?.[index]?.url?.message && <p className="mt-1 text-xs text-rose-300">{errors.memoryCapsule.importantLinks[index]?.url?.message}</p>}</div>)}</div></section>
              </>}
            </motion.div>
          </AnimatePresence>
        </CardContent>
        <div className="flex flex-col gap-3 border-t border-white/[0.07] bg-black/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7 lg:px-9">
          <div className="min-h-5 text-xs text-slate-600">{mode === "create" && draftMessage}</div>
          <div className="flex flex-wrap justify-end gap-2">
            <Button asChild variant="ghost"><Link to={cancelTo}>Cancel</Link></Button>
            {step > 1 && <Button type="button" variant="secondary" onClick={() => setStep((current) => current - 1)}><ArrowLeft className="size-4" /> Back</Button>}
            {step < 3 ? <Button type="button" onClick={nextStep}>Continue <ArrowRight className="size-4" /></Button> : <Button type="submit" disabled={isSubmitting}><Save className="size-4" /> {mode === "create" ? "Preserve project" : "Save changes"}</Button>}
          </div>
        </div>
      </Card>
    </form>
  );
}
