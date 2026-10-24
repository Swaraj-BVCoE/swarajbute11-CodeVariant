import { useEffect, useState } from 'react';
import { useArchive } from '../../features/archive/ArchiveContext';
import { UserStats } from '../../components/dashboard/UserStats';
import { RecentActivity } from '../../components/dashboard/RecentActivity';
import { Recommendations } from '../../components/dashboard/Recommendations';

export function Dashboard() {
  const { projects } = useArchive();
  const [stats, setStats] = useState({ total: 0, active: 0, paused: 0, completed: 0 });

  useEffect(() => {
    const total = projects.length;
    const active = projects.filter(p => p.status === 'active').length;
    const paused = projects.filter(p => p.status === 'paused').length;
    const completed = projects.filter(p => p.status === 'completed').length;
    setStats({ total, active, paused, completed });
  }, [projects]);

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-8">
      <h1 className="text-3xl font-bold font-display">🗂️ My Productivity Dashboard</h1>
      <UserStats stats={stats} />
      <RecentActivity projects={projects.slice(0, 5)} />
      <Recommendations projects={projects} />
    </div>
  );
}
