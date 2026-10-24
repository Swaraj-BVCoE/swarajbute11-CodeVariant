import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Circle, FileText, Link2, Plus, Trash2, X } from "lucide-react";
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
import { ActionZone } from "../canvas-protocol/ActionZone";
import { CanvasBoard } from "../canvas-protocol/CanvasBoard";
import { CanvasGuide } from "../canvas-protocol/CanvasGuide";
import { DraggableCanvasCard } from "../canvas-protocol/DraggableCanvasCard";
import type { CanvasCardData, CanvasZoneData } from "../canvas-protocol/canvasProtocol";

type ProjectFormProps = {
  mode: "create" | "edit";
  initialValues: ProjectFormValues;
  cancelTo: string;
  onSubmitProject: (values: ProjectFormValues) => boolean;
};

const steps = [
  { number: 1, label: "Original idea", note: "What you wanted to create" },
  { number: 2, label: "Stopping point", note: "Progress and present state" },
  { number: 3, label: "Why it paused", note: "Blocker and memory capsule" },
];

const stepFields: Record<number, FieldPath<ProjectFormValues>[]> = {
  1: ["name", "shortDescription", "intendedOutcome", "technologies", "repositoryUrl", "demoUrl"],
  2: ["workItems", "status", "startDate", "lastWorkedDate"],
  3: ["abandonmentReason", "abandonmentNotes", "memoryCapsule"],
};

function Field({ label, hint, error, required, children }: { label: string; hint?: string; error?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold uppercase tracking-wider text-[#5C605A]">
        <span>
          {label}
          {required && <span className="ml-1 text-[#A45839]">*</span>}
        </span>
        {hint && <span className="text-[0.72rem] font-normal normal-case text-[#858780]">{hint}</span>}
      </span>
      {children}
      {error && (
        <span className="mt-1.5 block text-xs font-medium text-[#9E2A2B]" role="alert">
          {error}
        </span>
      )}
    </label>
  );
}

function SectionIntro({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mb-8">
      <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-[#606E54]">
        <span className="h-px w-5 bg-[#606E54]" />
        {eyebrow}
      </p>
      <h2 className="mt-2.5 font-display text-2xl font-medium tracking-[-0.02em] text-[#252724] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#5C605A]">
        {description}
      </p>
    </div>
  );
}

export function ProjectForm({ mode, initialValues, cancelTo, onSubmitProject }: ProjectFormProps) {
  const draftLoad = useMemo(() => (mode === "create" ? loadProjectDraft() : { ok: true as const, data: null }), [mode]);
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
      setDraftMessage(result.ok ? "Draft preserved locally" : result.message);
    }, 450);
    return () => clearTimeout(timer);
  }, [isDirty, mode, observedValues, pendingDraft, restoredDraft, saved]);

  const restoreDraft = () => {
    if (!pendingDraft) return;
    reset(pendingDraft.values);
    setPendingDraft(null);
    setRestoredDraft(true);
    setDraftMessage("Draft restored — review before saving");
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

  const persistValidForm = (values: ProjectFormValues) => {
    if (!onSubmitProject(values)) return false;
    setSaved(true);
    if (mode === "create") clearProjectDraft();
    return true;
  };

  const handleInvalidSubmit = (formErrors: FieldErrors<ProjectFormValues>) => {
    if (formErrors.name || formErrors.shortDescription || formErrors.intendedOutcome || formErrors.technologies || formErrors.repositoryUrl || formErrors.demoUrl) setStep(1);
    else if (formErrors.workItems || formErrors.status || formErrors.startDate || formErrors.lastWorkedDate) setStep(2);
    else setStep(3);
  };

  const handleCanvasDrop = async (_card: CanvasCardData, zone: CanvasZoneData) => {
    if (mode !== "create" || zone.zoneType !== "save-to-archive" || isSubmitting) return false;
    let persisted = false;
    await handleSubmit(
      (values) => { persisted = persistValidForm(values); },
      (formErrors) => { handleInvalidSubmit(formErrors); },
    )();
    return persisted;
  };

  const today = new Date().toISOString().slice(0, 10);
  const completedCount = workItems.fields.filter((item) => item.completed).length;
  const unfinishedCount = workItems.fields.length - completedCount;

  return (
    <form onSubmit={(event) => event.preventDefault()} noValidate>
      {(pendingDraft || draftIssue) && (
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-[#E4D8BE] bg-[#F8F4EC] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-[#252724]">
              {pendingDraft ? "A previous draft was found" : "Draft notice"}
            </p>
            <p className="mt-0.5 text-xs text-[#5C605A]">
              {pendingDraft
                ? `Saved on ${new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" }).format(new Date(pendingDraft.updatedAt))}.`
                : draftIssue}
            </p>
          </div>
          <div className="flex gap-2">
            {pendingDraft && (
              <Button type="button" size="sm" onClick={restoreDraft}>
                Restore draft
              </Button>
            )}
            <Button type="button" variant="secondary" size="sm" onClick={discardDraft}>
              Discard
            </Button>
          </div>
        </div>
      )}

      {/* Stepper Navigation */}
      <div className="mb-6 grid gap-2 rounded-xl border border-[#E6E4DD] bg-[#FFFFFF] p-2 shadow-xs sm:grid-cols-3">
        {steps.map((item) => (
          <button
            key={item.number}
            type="button"
            onClick={() => item.number < step && setStep(item.number)}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3.5 py-3 text-left transition-all duration-200 cursor-pointer",
              step === item.number
                ? "bg-[#F3F2EE] border border-[#D8D6CE]"
                : item.number < step
                ? "hover:bg-[#FAF9F6]"
                : "opacity-45 cursor-default",
            )}
          >
            <span
              className={cn(
                "grid size-7 shrink-0 place-items-center rounded-full text-xs font-semibold",
                step === item.number
                  ? "bg-[#606E54] text-white"
                  : item.number < step
                  ? "bg-[#EBF0E6] text-[#606E54]"
                  : "bg-[#EBEAE4] text-[#858780]",
              )}
            >
              {item.number < step ? <Check className="size-3.5" /> : item.number}
            </span>
            <span>
              <span className="block text-sm font-semibold text-[#252724]">{item.label}</span>
              <span className="hidden text-xs text-[#858780] xl:block">{item.note}</span>
            </span>
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <CardContent className="p-6 sm:p-9">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.16 }}
            >
              {step === 1 && (
                <>
                  <SectionIntro
                    eyebrow="Step 1 of 3"
                    title="Remember the original idea"
                    description="Capture enough context that your future self can immediately understand what made this idea exciting."
                  />
                  <div className="grid gap-6">
                    <Field label="Project name" required error={errors.name?.message}>
                      <Input {...register("name")} aria-invalid={Boolean(errors.name)} placeholder="e.g. Sunday Sketchbook" />
                    </Field>
                    <Field
                      label="Short description"
                      required
                      hint={`${observedValues.shortDescription?.length ?? 0}/240`}
                      error={errors.shortDescription?.message}
                    >
                      <Textarea
                        {...register("shortDescription")}
                        aria-invalid={Boolean(errors.shortDescription)}
                        rows={2}
                        placeholder="A one-sentence summary of the project…"
                      />
                    </Field>
                    <Field label="What did you want to build?" required error={errors.intendedOutcome?.message}>
                      <Textarea
                        {...register("intendedOutcome")}
                        aria-invalid={Boolean(errors.intendedOutcome)}
                        rows={3}
                        placeholder="Describe the intention, problem, or creative outcome you hoped to achieve…"
                      />
                    </Field>
                    <Field label="Technologies & Tools" hint="Press Enter to add" error={errors.technologies?.message}>
                      <div className="flex gap-2">
                        <Input
                          value={technologyInput}
                          onChange={(event) => setTechnologyInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              addTechnology();
                            }
                          }}
                          placeholder="TypeScript, Next.js, Figma, Rust…"
                        />
                        <Button type="button" variant="secondary" onClick={addTechnology}>
                          <Plus className="size-4" /> Add
                        </Button>
                      </div>
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {technologies.map((technology, index) => (
                          <Badge key={`${technology}-${index}`} variant="violet">
                            {technology}
                            <button
                              type="button"
                              aria-label={`Remove ${technology}`}
                              onClick={() =>
                                setValue(
                                  "technologies",
                                  technologies.filter((_, itemIndex) => itemIndex !== index),
                                  { shouldDirty: true, shouldValidate: true },
                                )
                              }
                              className="ml-1 text-[#5C605A] hover:text-[#252724]"
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </Field>
                    <div className="grid gap-6 sm:grid-cols-2">
                      <Field label="Repository URL" error={errors.repositoryUrl?.message}>
                        <Input
                          {...register("repositoryUrl")}
                          aria-invalid={Boolean(errors.repositoryUrl)}
                          inputMode="url"
                          placeholder="https://github.com/…"
                        />
                      </Field>
                      <Field label="Demo URL" error={errors.demoUrl?.message}>
                        <Input
                          {...register("demoUrl")}
                          aria-invalid={Boolean(errors.demoUrl)}
                          inputMode="url"
                          placeholder="https://…"
                        />
                      </Field>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <SectionIntro
                    eyebrow="Step 2 of 3"
                    title="Mark the exact stopping point"
                    description="Separate what already works from what remains incomplete. This acts as a clear memory aid, not a stressful to-do list."
                  />
                  <div className="grid gap-7 lg:grid-cols-2">
                    {([true, false] as const).map((completed) => (
                      <section key={String(completed)} className="rounded-xl border border-[#E6E4DD] bg-[#FAF9F6] p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <p className={cn("flex items-center gap-2 text-sm font-semibold", completed ? "text-[#606E54]" : "text-[#9E7D4E]")}>
                            {completed ? <CheckCircle2 className="size-4" /> : <Circle className="size-4" />}
                            <span>{completed ? "Completed" : "Still unfinished"}</span>
                            <span className="text-xs font-normal text-[#858780]">({completed ? completedCount : unfinishedCount})</span>
                          </p>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => workItems.append({ id: createStableId("work"), text: "", completed })}
                          >
                            <Plus className="size-3.5" /> Add item
                          </Button>
                        </div>
                        <div className="space-y-2.5">
                          {workItems.fields.map(
                            (field, index) =>
                              field.completed === completed && (
                                <div key={field.fieldKey}>
                                  <div className="flex gap-2">
                                    <Input
                                      {...register(`workItems.${index}.text`)}
                                      aria-label={`${completed ? "Completed" : "Unfinished"} work item`}
                                      placeholder={completed ? "What already works reliably?" : "What still needs attention?"}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => workItems.remove(index)}
                                      aria-label="Remove item"
                                    >
                                      <Trash2 className="size-4 text-[#858780]" />
                                    </Button>
                                  </div>
                                  {errors.workItems?.[index]?.text?.message && (
                                    <p className="mt-1 text-xs text-[#9E2A2B]">{errors.workItems[index]?.text?.message}</p>
                                  )}
                                </div>
                              ),
                          )}
                        </div>
                      </section>
                    ))}
                  </div>
                  {typeof errors.workItems?.message === "string" && (
                    <p className="mt-2 text-xs text-[#9E2A2B]">{errors.workItems.message}</p>
                  )}
                  <div className="mt-8 grid gap-6 border-t border-[#E6E4DD] pt-7 sm:grid-cols-3">
                    <Field label="Current status" required error={errors.status?.message}>
                      <Select {...register("status")}>
                        {projectStatuses.map((status) => (
                          <option key={status} value={status}>
                            {statusLabels[status]}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Started" error={errors.startDate?.message}>
                      <Input type="date" max={today} {...register("startDate")} />
                    </Field>
                    <Field label="Last worked" error={errors.lastWorkedDate?.message}>
                      <Input type="date" max={today} {...register("lastWorkedDate")} />
                    </Field>
                  </div>
                </>
              )}

              {step === 3 && (
                <>
                  <SectionIntro
                    eyebrow="Step 3 of 3"
                    title="Leave yourself an intentional handoff"
                    description="Name the reason momentum faded, then preserve the specific clues that will make returning seamless."
                  />
                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Why did work stop?" required error={errors.abandonmentReason?.message}>
                      <Select {...register("abandonmentReason")}>
                        {abandonmentReasons.map((reason) => (
                          <option key={reason} value={reason}>
                            {abandonmentReasonLabels[reason]}
                          </option>
                        ))}
                      </Select>
                    </Field>
                    <Field label="Context notes" error={errors.abandonmentNotes?.message}>
                      <Textarea
                        {...register("abandonmentNotes")}
                        rows={2}
                        placeholder="What shifted? Time, interest, technical roadblock, or changed priorities?"
                      />
                    </Field>
                  </div>

                  <div className="my-8 flex items-center gap-3">
                    <span className="h-px flex-1 bg-[#E6E4DD]" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#606E54]">
                      Memory Capsule Details
                    </span>
                    <span className="h-px flex-1 bg-[#E6E4DD]" />
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <Field label="Last thing that worked" error={errors.memoryCapsule?.lastThingThatWorked?.message}>
                      <Textarea
                        {...register("memoryCapsule.lastThingThatWorked")}
                        rows={2}
                        placeholder="The last commit, component, or screen that was working properly…"
                      />
                    </Field>
                    <Field label="Exact stopping point" error={errors.memoryCapsule?.exactStoppingPoint?.message}>
                      <Textarea
                        {...register("memoryCapsule.exactStoppingPoint")}
                        rows={2}
                        placeholder="The specific blocker, design question, or bug where work stopped…"
                      />
                    </Field>
                    <Field label="Suggested restart action" error={errors.memoryCapsule?.suggestedNextStep?.message}>
                      <Textarea
                        {...register("memoryCapsule.suggestedNextStep")}
                        rows={2}
                        placeholder="One modest, high-leverage 15-minute action to pick up momentum…"
                      />
                    </Field>
                    <Field label="Note to future self" error={errors.memoryCapsule?.noteToFutureSelf?.message}>
                      <Textarea
                        {...register("memoryCapsule.noteToFutureSelf")}
                        rows={2}
                        placeholder="What tone of mind or intuition would you want to recall?"
                      />
                    </Field>
                  </div>

                  <section className="mt-7">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#5C605A]">
                        <Link2 className="size-4 text-[#606E54]" /> Reference Links
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => importantLinks.append({ id: createStableId("link"), url: "" })}
                      >
                        <Plus className="size-3.5" /> Add reference
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {importantLinks.fields.map((field, index) => (
                        <div key={field.fieldKey}>
                          <div className="flex gap-2">
                            <Input
                              {...register(`memoryCapsule.importantLinks.${index}.url`)}
                              inputMode="url"
                              aria-label="Important link"
                              placeholder="https://…"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => importantLinks.remove(index)}
                              aria-label="Remove link"
                            >
                              <Trash2 className="size-4 text-[#858780]" />
                            </Button>
                          </div>
                          {errors.memoryCapsule?.importantLinks?.[index]?.url?.message && (
                            <p className="mt-1 text-xs text-[#9E2A2B]">
                              {errors.memoryCapsule.importantLinks[index]?.url?.message}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </CardContent>

        <div className="flex flex-col gap-3 border-t border-[#E6E4DD] bg-[#FAF9F6] px-6 py-4.5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
          <div className="min-h-5 text-xs text-[#858780]">{mode === "create" && draftMessage}</div>
          <div className="flex flex-wrap justify-end gap-2.5">
            <Button asChild variant="ghost">
              <Link to={cancelTo}>Cancel</Link>
            </Button>
            {step > 1 && (
              <Button type="button" variant="secondary" onClick={() => setStep((current) => current - 1)}>
                <ArrowLeft className="size-4" /> Back
              </Button>
            )}
            {step < 3 ? (
              <Button type="button" onClick={nextStep}>
                Continue <ArrowRight className="size-4" />
              </Button>
            ) : mode === "edit" ? (
              <Button type="button" disabled={isSubmitting} onClick={() => void handleSubmit(persistValidForm, handleInvalidSubmit)()}>
                Save changes
              </Button>
            ) : null}
          </div>
        </div>

        {step === 3 && mode === "create" && (
          <CanvasBoard onDrop={handleCanvasDrop}>
            <div className="canvas-submit-panel">
              <CanvasGuide />
              <div className="canvas-submit-grid">
                <DraggableCanvasCard
                  data={{ kind: "canvas-card", cardType: "project-draft", cardId: "project-draft:create", label: observedValues.name?.trim() || "Untitled Project Draft" }}
                  className="canvas-draft-card"
                  handleLabel="Drag the project draft to Save to Archive"
                >
                  <div className="flex items-start gap-3">
                    <span className="canvas-draft-icon"><FileText className="size-5" /></span>
                    <div className="min-w-0">
                      <p className="canvas-kicker">Project draft</p>
                      <h3>{observedValues.name?.trim() || "Untitled project"}</h3>
                      <p>{observedValues.shortDescription?.trim() || "Complete the form, then move this card into the archive zone."}</p>
                      <div className="canvas-draft-meta">
                        <span>{technologies.length} tools</span>
                        <span>{workItems.fields.length} work items</span>
                        <span>{statusLabels[observedValues.status ?? "paused"]}</span>
                      </div>
                    </div>
                  </div>
                </DraggableCanvasCard>
                <ActionZone
                  data={{ kind: "action-zone", zoneType: "save-to-archive", label: "Save to Archive" }}
                  instruction="Drop the completed Project Draft here to validate and preserve it."
                />
              </div>
            </div>
          </CanvasBoard>
        )}
      </Card>
    </form>
  );
}
