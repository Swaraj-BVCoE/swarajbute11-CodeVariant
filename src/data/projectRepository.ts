import type { Project } from "../domain/project";
import { cloneSeedProjects } from "./seedProjects";

export const PROJECT_STORAGE_KEY = "project-graveyard:archive";
export const PROJECT_STORAGE_VERSION = 1;

type StoredArchive = {
  version: typeof PROJECT_STORAGE_VERSION;
  projects: Project[];
};

export type RepositoryErrorCode = "malformed-data" | "unsupported-version" | "storage-read-failed" | "storage-write-failed" | "not-found";

export type RepositoryError = {
  code: RepositoryErrorCode;
  message: string;
};

export type RepositoryResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: RepositoryError };

export interface ProjectRepository {
  list(): RepositoryResult<Project[]>;
  getById(id: string): RepositoryResult<Project>;
  create(project: Project): RepositoryResult<Project>;
  update(project: Project): RepositoryResult<Project>;
  delete(id: string): RepositoryResult<void>;
  setRevisitLater(id: string, revisitLater: boolean): RepositoryResult<Project>;
  resetDemoData(): RepositoryResult<Project[]>;
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

function cloneProjects(projects: Project[]): Project[] {
  return JSON.parse(JSON.stringify(projects)) as Project[];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isProject(value: unknown): value is Project {
  if (!isRecord(value)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.name === "string" &&
    typeof value.shortDescription === "string" &&
    typeof value.status === "string" &&
    typeof value.abandonmentReason === "string" &&
    typeof value.revisitLater === "boolean" &&
    typeof value.createdAt === "string" &&
    typeof value.updatedAt === "string" &&
    Array.isArray(value.technologies) &&
    Array.isArray(value.workItems) &&
    Array.isArray(value.timeline)
  );
}

export class LocalStorageProjectRepository implements ProjectRepository {
  constructor(
    private readonly storage: StorageLike,
    private readonly now: () => string = () => new Date().toISOString(),
  ) {}

  list(): RepositoryResult<Project[]> {
    let raw: string | null;
    try {
      raw = this.storage.getItem(PROJECT_STORAGE_KEY);
    } catch {
      return { ok: false, error: { code: "storage-read-failed", message: "The browser blocked access to local project data." } };
    }

    if (raw === null) {
      const projects = cloneSeedProjects();
      const seeded = this.write(projects);
      return seeded.ok ? { ok: true, data: cloneProjects(projects) } : seeded;
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      if (!isRecord(parsed) || typeof parsed.version !== "number" || !Array.isArray(parsed.projects)) {
        return { ok: false, error: { code: "malformed-data", message: "Saved project data is unreadable. Reset demo data to recover safely." } };
      }
      if (parsed.version !== PROJECT_STORAGE_VERSION) {
        return { ok: false, error: { code: "unsupported-version", message: "Saved project data uses an unsupported version." } };
      }
      if (!parsed.projects.every(isProject)) {
        return { ok: false, error: { code: "malformed-data", message: "Some saved projects are incomplete or damaged. Reset demo data to recover safely." } };
      }
      return { ok: true, data: cloneProjects(parsed.projects) };
    } catch {
      return { ok: false, error: { code: "malformed-data", message: "Saved project data is unreadable. Reset demo data to recover safely." } };
    }
  }

  getById(id: string): RepositoryResult<Project> {
    const listed = this.list();
    if (!listed.ok) return listed;
    const project = listed.data.find((candidate) => candidate.id === id);
    return project
      ? { ok: true, data: cloneProjects([project])[0] }
      : { ok: false, error: { code: "not-found", message: "That project could not be found." } };
  }

  create(project: Project): RepositoryResult<Project> {
    const listed = this.list();
    if (!listed.ok) return listed;
    const saved = this.write([project, ...listed.data]);
    return saved.ok ? { ok: true, data: cloneProjects([project])[0] } : saved;
  }

  update(project: Project): RepositoryResult<Project> {
    const listed = this.list();
    if (!listed.ok) return listed;
    const index = listed.data.findIndex((candidate) => candidate.id === project.id);
    if (index < 0) return { ok: false, error: { code: "not-found", message: "That project could not be found." } };
    const next = [...listed.data];
    next[index] = project;
    const saved = this.write(next);
    return saved.ok ? { ok: true, data: cloneProjects([project])[0] } : saved;
  }

  delete(id: string): RepositoryResult<void> {
    const listed = this.list();
    if (!listed.ok) return listed;
    if (!listed.data.some((project) => project.id === id)) {
      return { ok: false, error: { code: "not-found", message: "That project could not be found." } };
    }
    return this.write(listed.data.filter((project) => project.id !== id));
  }

  setRevisitLater(id: string, revisitLater: boolean): RepositoryResult<Project> {
    const listed = this.list();
    if (!listed.ok) return listed;
    const project = listed.data.find((candidate) => candidate.id === id);
    if (!project) return { ok: false, error: { code: "not-found", message: "That project could not be found." } };
    const updated: Project = {
      ...project,
      revisitLater,
      status: revisitLater && project.status === "paused" ? "revisit-later" : !revisitLater && project.status === "revisit-later" ? "paused" : project.status,
      updatedAt: this.now(),
    };
    const next = listed.data.map((candidate) => candidate.id === id ? updated : candidate);
    const saved = this.write(next);
    return saved.ok ? { ok: true, data: cloneProjects([updated])[0] } : saved;
  }

  resetDemoData(): RepositoryResult<Project[]> {
    const projects = cloneSeedProjects();
    const saved = this.write(projects);
    return saved.ok ? { ok: true, data: cloneProjects(projects) } : saved;
  }

  private write(projects: Project[]): RepositoryResult<void> {
    const archive: StoredArchive = { version: PROJECT_STORAGE_VERSION, projects };
    try {
      this.storage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(archive));
      return { ok: true, data: undefined };
    } catch {
      return { ok: false, error: { code: "storage-write-failed", message: "Changes could not be saved in this browser. Your previous data is unchanged." } };
    }
  }
}

const unavailableStorage: StorageLike = {
  getItem: () => null,
  setItem: () => undefined,
};

function resolveBrowserStorage(): StorageLike {
  if (typeof window === "undefined") return unavailableStorage;
  try {
    return window.localStorage;
  } catch {
    return {
      getItem: () => { throw new Error("Local storage is unavailable"); },
      setItem: () => { throw new Error("Local storage is unavailable"); },
    };
  }
}

export const browserProjectRepository = new LocalStorageProjectRepository(
  resolveBrowserStorage(),
);
