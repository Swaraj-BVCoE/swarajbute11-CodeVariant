import { z } from "zod";
import { abandonmentReasons, projectStatuses } from "../../domain/project";
import type { ProjectFormValues } from "./projectFormSchema";

export const PROJECT_DRAFT_KEY = "project-graveyard:create-draft";
const DRAFT_VERSION = 1;

export type ProjectDraft = { values: ProjectFormValues; updatedAt: string };
export type DraftResult<T> = { ok: true; data: T } | { ok: false; message: string };
type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const draftValuesSchema: z.ZodType<ProjectFormValues> = z.object({
  name: z.string(),
  shortDescription: z.string(),
  intendedOutcome: z.string(),
  technologies: z.array(z.string()),
  repositoryUrl: z.string(),
  demoUrl: z.string(),
  workItems: z.array(z.object({ id: z.string(), text: z.string(), completed: z.boolean() })),
  status: z.enum(projectStatuses),
  startDate: z.string(),
  lastWorkedDate: z.string(),
  abandonmentReason: z.enum(abandonmentReasons),
  abandonmentNotes: z.string(),
  memoryCapsule: z.object({
    lastThingThatWorked: z.string(),
    exactStoppingPoint: z.string(),
    suggestedNextStep: z.string(),
    importantLinks: z.array(z.object({ id: z.string(), url: z.string() })),
    noteToFutureSelf: z.string(),
  }),
});

function browserStorage(): StorageLike | null {
  try { return window.localStorage; } catch { return null; }
}

export function loadProjectDraft(storage = browserStorage()): DraftResult<ProjectDraft | null> {
  if (!storage) return { ok: false, message: "Draft storage is unavailable in this browser." };
  try {
    const raw = storage.getItem(PROJECT_DRAFT_KEY);
    if (!raw) return { ok: true, data: null };
    const parsed = JSON.parse(raw) as { version?: unknown; values?: unknown; updatedAt?: unknown };
    if (parsed.version !== DRAFT_VERSION || typeof parsed.updatedAt !== "string") throw new Error("Invalid draft");
    const values = draftValuesSchema.parse(parsed.values);
    return { ok: true, data: { values, updatedAt: parsed.updatedAt } };
  } catch {
    return { ok: false, message: "The saved draft could not be restored. You can discard it safely." };
  }
}

export function saveProjectDraft(values: ProjectFormValues, storage = browserStorage()): DraftResult<void> {
  if (!storage) return { ok: false, message: "Draft storage is unavailable in this browser." };
  try {
    storage.setItem(PROJECT_DRAFT_KEY, JSON.stringify({ version: DRAFT_VERSION, values, updatedAt: new Date().toISOString() }));
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, message: "This draft could not be saved locally." };
  }
}

export function clearProjectDraft(storage = browserStorage()): DraftResult<void> {
  if (!storage) return { ok: false, message: "Draft storage is unavailable in this browser." };
  try {
    storage.removeItem(PROJECT_DRAFT_KEY);
    return { ok: true, data: undefined };
  } catch {
    return { ok: false, message: "The saved draft could not be removed." };
  }
}
