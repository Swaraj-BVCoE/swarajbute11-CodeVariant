import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { browserProjectRepository, type ProjectRepository } from "../../data/projectRepository";
import type { Project } from "../../domain/project";

type ArchiveNotice = { type: "success" | "error"; message: string } | null;

type ArchiveContextValue = {
  projects: Project[];
  notice: ArchiveNotice;
  createProject: (project: Project) => boolean;
  updateProject: (project: Project) => boolean;
  deleteProject: (id: string) => boolean;
  toggleRevisitLater: (id: string, nextValue: boolean) => boolean;
  resetDemoData: () => boolean;
  dismissNotice: () => void;
};

const ArchiveContext = createContext<ArchiveContextValue | null>(null);

export function ArchiveProvider({ children, repository = browserProjectRepository }: { children: ReactNode; repository?: ProjectRepository }) {
  const initial = useMemo(() => repository.list(), [repository]);
  const [projects, setProjects] = useState<Project[]>(initial.ok ? initial.data : []);
  const [notice, setNotice] = useState<ArchiveNotice>(initial.ok ? null : { type: "error", message: initial.error.message });

  const createProject = useCallback((project: Project) => {
    const result = repository.create(project);
    if (!result.ok) {
      setNotice({ type: "error", message: result.error.message });
      return false;
    }
    setProjects((current) => [result.data, ...current]);
    setNotice({ type: "success", message: `“${project.name}” was preserved in your archive.` });
    return true;
  }, [repository]);

  const updateProject = useCallback((project: Project) => {
    const result = repository.update(project);
    if (!result.ok) {
      setNotice({ type: "error", message: result.error.message });
      return false;
    }
    setProjects((current) => current.map((candidate) => candidate.id === project.id ? result.data : candidate));
    setNotice({ type: "success", message: `Changes to “${project.name}” were saved.` });
    return true;
  }, [repository]);

  const deleteProject = useCallback((id: string) => {
    const project = projects.find((candidate) => candidate.id === id);
    const result = repository.delete(id);
    if (!result.ok) {
      setNotice({ type: "error", message: result.error.message });
      return false;
    }
    setProjects((current) => current.filter((candidate) => candidate.id !== id));
    setNotice({ type: "success", message: project ? `“${project.name}” was removed from this browser.` : "Project removed." });
    return true;
  }, [projects, repository]);

  const toggleRevisitLater = useCallback((id: string, nextValue: boolean) => {
    const result = repository.setRevisitLater(id, nextValue);
    if (!result.ok) {
      setNotice({ type: "error", message: result.error.message });
      return false;
    }
    setProjects((current) => current.map((project) => project.id === id ? result.data : project));
    setNotice({ type: "success", message: nextValue ? "Saved for a later revisit." : "Removed from the revisit list." });
    return true;
  }, [repository]);

  const resetDemoData = useCallback(() => {
    const result = repository.resetDemoData();
    if (!result.ok) {
      setNotice({ type: "error", message: result.error.message });
      return false;
    }
    setProjects(result.data);
    setNotice({ type: "success", message: "Demo archive restored." });
    return true;
  }, [repository]);

  const value = useMemo(() => ({ projects, notice, createProject, updateProject, deleteProject, toggleRevisitLater, resetDemoData, dismissNotice: () => setNotice(null) }), [projects, notice, createProject, updateProject, deleteProject, toggleRevisitLater, resetDemoData]);
  return <ArchiveContext.Provider value={value}>{children}</ArchiveContext.Provider>;
}

// The provider and its colocated hook form one public archive boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useArchive() {
  const value = useContext(ArchiveContext);
  if (!value) throw new Error("useArchive must be used inside ArchiveProvider");
  return value;
}
