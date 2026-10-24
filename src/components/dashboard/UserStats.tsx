type Stats = {
  total: number;
  active: number;
  paused: number;
  completed: number;
};

type UserStatsProps = { stats: Stats };

export function UserStats({ stats }: UserStatsProps) {
  const cards = [
    { label: 'Total projects', value: stats.total, color: 'text-violet-600' },
    { label: 'Active / Reviving', value: stats.active, color: 'text-emerald-600' },
    { label: 'Paused', value: stats.paused, color: 'text-amber-600' },
    { label: 'Archived', value: stats.completed, color: 'text-slate-500' },
  ];

  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">Overview</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs flex flex-col gap-1"
          >
            <span className={"text-3xl font-extrabold " + card.color}>{card.value}</span>
            <span className="text-xs text-slate-500">{card.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
