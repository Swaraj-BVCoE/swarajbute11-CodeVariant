import type { Project } from "../../domain/project";
import type { ProjectFormValues } from "./projectFormSchema";

export function createStableId(prefix: string) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  return `${prefix}-${id}`;
}

export function projectToFormValues(project: Project): ProjectFormValues {
  return {
    name: project.name,
    shortDescription: project.shortDescription,
    intendedOutcome: project.intendedOutcome,
    technologies: [...project.technologies],
    repositoryUrl: project.repositoryUrl ?? "",
    demoUrl: project.demoUrl ?? "",
    workItems: project.workItems.map((item) => ({ ...item })),
    status: project.status,
    startDate: project.startDate ?? "",
    lastWorkedDate: project.lastWorkedDate ?? "",
    abandonmentReason: project.abandonmentReason,
    abandonmentNotes: project.abandonmentNotes ?? "",
    memoryCapsule: {
      lastThingThatWorked: project.memoryCapsule?.lastThingThatWorked ?? "",
      exactStoppingPoint: project.memoryCapsule?.exactStoppingPoint ?? "",
      suggestedNextStep: project.memoryCapsule?.suggestedNextStep ?? "",
      importantLinks: (project.memoryCapsule?.importantLinks ?? []).map((url) => ({ id: createStableId("link"), url })),
      noteToFutureSelf: project.memoryCapsule?.noteToFutureSelf ?? "",
    },
  };
}

type MappingOptions = { now?: string; projectId?: string; eventId?: string };

export function mapFormToProject(values: ProjectFormValues, existing?: Project, options: MappingOptions = {}): Project {
  const now = options.now ?? new Date().toISOString();
  const projectId = existing?.id ?? options.projectId ?? createStableId("project");
  const timelineEvent = existing
    ? { id: options.eventId ?? createStableId("event"), type: "updated" as const, title: "Project context updated", description: "The saved project details were revised.", occurredAt: now }
    : { id: options.eventId ?? createStableId("event"), type: "created" as const, title: "Project preserved", description: "The project entered the archive.", occurredAt: now };

  return {
    id: projectId,
    name: values.name.trim(),
    shortDescription: values.shortDescription.trim(),
    intendedOutcome: values.intendedOutcome.trim(),
    technologies: values.technologies.map((item) => item.trim()).filter(Boolean),
    repositoryUrl: values.repositoryUrl.trim() || undefined,
    demoUrl: values.demoUrl.trim() || undefined,
    workItems: values.workItems.map((item) => ({ ...item, text: item.text.trim() })),
    status: values.status,
    abandonmentReason: values.abandonmentReason,
    abandonmentNotes: values.abandonmentNotes.trim() || undefined,
    startDate: values.startDate || undefined,
    lastWorkedDate: values.lastWorkedDate || undefined,
    revisitLater: values.status === "revisit-later",
    memoryCapsule: {
      lastThingThatWorked: values.memoryCapsule.lastThingThatWorked.trim() || undefined,
      exactStoppingPoint: values.memoryCapsule.exactStoppingPoint.trim() || undefined,
      suggestedNextStep: values.memoryCapsule.suggestedNextStep.trim() || undefined,
      importantLinks: values.memoryCapsule.importantLinks.map((link) => link.url.trim()).filter(Boolean),
      noteToFutureSelf: values.memoryCapsule.noteToFutureSelf.trim() || undefined,
    },
    blockerRechecks: existing?.blockerRechecks ?? [],
    scopeRevisions: existing?.scopeRevisions ?? [],
    revivalDecisions: existing?.revivalDecisions ?? [],
    timeline: [...(existing?.timeline ?? []), timelineEvent],
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}
