import { Clock3, FolderOpen, HeartPulse, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArchiveGrid } from "../features/archive/ArchiveGrid";
import { ResetDemoDataDialog } from "../features/archive/ResetDemoDataDialog";
import { useArchive } from "../features/archive/ArchiveContext";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";

export function AllProjectsPage() {
  const { projects, resetDemoData } = useArchive();
  const [resetOpen, setResetOpen] = useState(false);
  const stats = [
    { label: "Sleeping ideas", value: projects.filter((project) => project.status !== "archived").length, note: `${projects.length} total in archive`, icon: FolderOpen, color: "text-violet-300 bg-violet-400/10" },
    { label: "Ready to revisit", value: projects.filter((project) => project.revisitLater).length, note: "Saved for reflection", icon: Clock3, color: "text-amber-300 bg-amber-400/10" },
    { label: "Revived", value: projects.filter((project) => project.status === "reviving").length, note: "Back in motion", icon: HeartPulse, color: "text-emerald-300 bg-emerald-400/10" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Your idea archive"
        title="Welcome back to the graveyard."
        description="Every unfinished project still holds a useful story. Search the archive, notice what changed, and return when the timing feels right."
        action={<div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" size="lg" onClick={() => setResetOpen(true)}><RotateCcw className="size-4" /> Reset demo</Button><Button asChild size="lg"><Link to="/projects/new"><Plus className="size-4" /> Preserve a project</Link></Button></div>}
      />
      <PageContainer>
        <aside className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-300/10 bg-emerald-400/[0.045] px-4 py-3 text-sm text-slate-400">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.65)]" />
          <p><strong className="font-semibold text-slate-200">Guest archive:</strong> projects and changes stay only in this browser. No account or cloud sync is active.</p>
        </aside>
        <section className="grid gap-3 sm:grid-cols-3" aria-label="Archive overview">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="group transition-transform duration-300 hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${stat.color}`}><Icon className="size-5" /></span>
                  <div className="min-w-0"><div className="flex items-baseline gap-2"><strong className="font-display text-2xl text-white">{stat.value}</strong><span className="truncate text-sm font-semibold text-slate-300">{stat.label}</span></div><p className="text-xs text-slate-600">{stat.note}</p></div>
                </CardContent>
              </Card>
            );
          })}
        </section>
        <div className="mt-6"><ArchiveGrid projects={projects} emptyTitle="Your archive is empty" emptyDescription="Preserve an unfinished project to keep its story within reach." /></div>
      </PageContainer>
      <ResetDemoDataDialog open={resetOpen} onClose={() => setResetOpen(false)} onConfirm={resetDemoData} />
    </>
  );
}
