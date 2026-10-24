import type { Project } from '../../domain/project';

type RecommendationsProps = { projects: Project[] };

export function Recommendations({ projects }: RecommendationsProps) {
  const revisitCandidates = projects.filter((p: Project) => p.status === 'paused').slice(0, 3);

  if (revisitCandidates.length === 0) {
    return (
      <section>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Recommendations</h2>
        <p className="text-sm text-slate-400 italic">Nothing to recommend right now. Keep adding projects!</p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Recommendations</h2>
      <p className="text-xs text-slate-400 mb-3">These paused projects might be worth revisiting:</p>
      <ul className="space-y-2">
        {revisitCandidates.map((project: Project) => (
          <li
            key={project.id}
            className="flex items-center gap-3 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3"
          >
            <span className="text-amber-500 text-base">💡</span>
            <span className="flex-1 text-sm font-medium text-slate-800 truncate">{project.name}</span>
            <span className="text-xs text-slate-400 shrink-0">{project.shortDescription?.slice(0, 40) || ''}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
