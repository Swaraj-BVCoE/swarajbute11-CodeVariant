import type { Project } from '../../domain/project';

type RecentActivityProps = { projects: Project[] };

export function RecentActivity({ projects }: RecentActivityProps) {
  if (projects.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Recent Activity</h2>
        <p className="text-sm text-slate-400 italic">No projects yet. Add one to get started!</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Recent Activity</h2>
      <ul className="space-y-2">
        {projects.map((project) => (
          <li
            key={project.id}
            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-xs"
          >
            <span className="flex-1 text-sm font-medium text-slate-800 truncate">{project.name}</span>
            <span className="text-xs text-slate-400 shrink-0">
              {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : '—'}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
