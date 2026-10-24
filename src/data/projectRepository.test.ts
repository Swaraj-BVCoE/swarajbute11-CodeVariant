import { describe, expect, it } from "vitest";
import { LocalStorageProjectRepository, PROJECT_STORAGE_KEY } from "./projectRepository";

class MemoryStorage implements Storage {
  private readonly values = new Map<string, string>();
  get length() { return this.values.size; }
  clear() { this.values.clear(); }
  getItem(key: string) { return this.values.get(key) ?? null; }
  key(index: number) { return [...this.values.keys()][index] ?? null; }
  removeItem(key: string) { this.values.delete(key); }
  setItem(key: string, value: string) { this.values.set(key, value); }
}

describe("LocalStorageProjectRepository", () => {
  it("seeds only on first use and does not restore deleted examples", () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProjectRepository(storage);
    const firstLoad = repository.list();
    expect(firstLoad.ok).toBe(true);
    if (!firstLoad.ok) return;
    expect(firstLoad.data.length).toBeGreaterThan(2);

    firstLoad.data.forEach((project) => expect(repository.delete(project.id).ok).toBe(true));
    const freshInstance = new LocalStorageProjectRepository(storage);
    const afterReload = freshInstance.list();
    expect(afterReload.ok).toBe(true);
    if (afterReload.ok) expect(afterReload.data).toEqual([]);
  });

  it("persists a revisit toggle across repository instances", () => {
    const storage = new MemoryStorage();
    const fixedNow = "2026-10-24T12:00:00.000Z";
    const repository = new LocalStorageProjectRepository(storage, () => fixedNow);
    const initial = repository.list();
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const target = initial.data.find((project) => !project.revisitLater);
    expect(target).toBeDefined();
    if (!target) return;

    const result = repository.setRevisitLater(target.id, true);
    expect(result.ok).toBe(true);
    const reloaded = new LocalStorageProjectRepository(storage).getById(target.id);
    expect(reloaded.ok).toBe(true);
    if (reloaded.ok) {
      expect(reloaded.data.revisitLater).toBe(true);
      expect(reloaded.data.updatedAt).toBe(fixedNow);
    }
  });

  it("reports malformed data without overwriting it", () => {
    const storage = new MemoryStorage();
    storage.setItem(PROJECT_STORAGE_KEY, "not-json");
    const result = new LocalStorageProjectRepository(storage).list();
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("malformed-data");
    expect(storage.getItem(PROJECT_STORAGE_KEY)).toBe("not-json");
  });

  it("does not report a successful change when storage rejects a write", () => {
    const storage = new MemoryStorage();
    const repository = new LocalStorageProjectRepository(storage);
    const initial = repository.list();
    expect(initial.ok).toBe(true);
    if (!initial.ok) return;
    const before = storage.getItem(PROJECT_STORAGE_KEY);
    storage.setItem = () => { throw new Error("quota exceeded"); };

    const result = repository.setRevisitLater(initial.data[0].id, !initial.data[0].revisitLater);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("storage-write-failed");
    expect(storage.getItem(PROJECT_STORAGE_KEY)).toBe(before);
  });
});
