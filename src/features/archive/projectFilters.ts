import type { AbandonmentReason, Project, ProjectStatus } from "../../domain/project";

export type ArchiveSort = "recent-activity" | "newest-created" | "oldest-created";

export type ArchiveFilters = {
  query: string;
  status: ProjectStatus | "all";
  reason: AbandonmentReason | "all";
  sort: ArchiveSort;
};

export const defaultArchiveFilters: ArchiveFilters = {
  query: "",
  status: "all",
  reason: "all",
  sort: "recent-activity",
};

export function filterAndSortProjects(projects: Project[], filters: ArchiveFilters): Project[] {
  const query = filters.query.trim().toLocaleLowerCase();
  return projects
    .filter((project) => {
      const searchable = [project.name, project.shortDescription, ...project.technologies].join(" ").toLocaleLowerCase();
      return (
        (!query || searchable.includes(query)) &&
        (filters.status === "all" || project.status === filters.status) &&
        (filters.reason === "all" || project.abandonmentReason === filters.reason)
      );
    })
    .sort((left, right) => {
      if (filters.sort === "oldest-created") return left.createdAt.localeCompare(right.createdAt);
      if (filters.sort === "newest-created") return right.createdAt.localeCompare(left.createdAt);
      return right.updatedAt.localeCompare(left.updatedAt);
    });
}
