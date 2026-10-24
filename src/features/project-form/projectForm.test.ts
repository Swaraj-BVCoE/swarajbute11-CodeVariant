import { describe, expect, it } from "vitest";
import { seedProjects } from "../../data/seedProjects";
import { clearProjectDraft, loadProjectDraft, saveProjectDraft } from "./projectDraft";
import { mapFormToProject, projectToFormValues } from "./projectMapping";
import { emptyProjectFormValues, projectFormSchema } from "./projectFormSchema";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("project form validation", () => {
  it("rejects unsafe URL protocols and reversed project dates", () => {
    const values = projectToFormValues(seedProjects[0]);
    const result = projectFormSchema.safeParse({ ...values, repositoryUrl: "javascript:alert(1)", startDate: "2026-06-01", lastWorkedDate: "2026-05-01" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join(".") === "repositoryUrl")).toBe(true);
      expect(result.error.issues.some((issue) => issue.path.join(".") === "lastWorkedDate")).toBe(true);
    }
  });

  it("accepts complete http and https links", () => {
    const values = projectToFormValues(seedProjects[0]);
    const result = projectFormSchema.safeParse({ ...values, repositoryUrl: "https://github.com/example/project", demoUrl: "http://localhost:4173" });
    expect(result.success).toBe(true);
  });
});

describe("project history mapping", () => {
  it("creates a stable project with a creation timeline event", () => {
    const values = projectToFormValues(seedProjects[0]);
    const project = mapFormToProject(values, undefined, { now: "2026-10-24T10:00:00.000Z", projectId: "project-new", eventId: "event-new" });
    expect(project.id).toBe("project-new");
    expect(project.createdAt).toBe("2026-10-24T10:00:00.000Z");
    expect(project.timeline).toEqual([expect.objectContaining({ id: "event-new", type: "created" })]);
  });

  it("preserves related history while appending a meaningful edit", () => {
    const existing = seedProjects[2];
    const values = { ...projectToFormValues(existing), name: "Tiny Museum, renewed" };
    const updated = mapFormToProject(values, existing, { now: "2026-10-24T11:00:00.000Z", eventId: "event-edit" });
    expect(updated.createdAt).toBe(existing.createdAt);
    expect(updated.revivalDecisions).toEqual(existing.revivalDecisions);
    expect(updated.timeline.slice(0, -1)).toEqual(existing.timeline);
    expect(updated.timeline.at(-1)).toEqual(expect.objectContaining({ id: "event-edit", type: "updated" }));
  });
});

describe("create-form draft", () => {
  it("round-trips incomplete form values and clears explicitly", () => {
    const storage = new MemoryStorage();
    const values = { ...emptyProjectFormValues, name: "A half-written idea" };
    expect(saveProjectDraft(values, storage).ok).toBe(true);
    const loaded = loadProjectDraft(storage);
    expect(loaded.ok).toBe(true);
    if (loaded.ok) expect(loaded.data?.values.name).toBe("A half-written idea");
    expect(clearProjectDraft(storage).ok).toBe(true);
    const afterClear = loadProjectDraft(storage);
    expect(afterClear.ok && afterClear.data === null).toBe(true);
  });
});
