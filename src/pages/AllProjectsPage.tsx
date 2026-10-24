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
    { label: "Sleeping ideas", value: projects.filter((project) => project.status !== "archived").length, note: `${projects.length} total in archive`, icon: FolderOpen, color: "text-[#351505] bg-gradient-to-br from-[#ffb47f] to-[#ff6422]" },
    { label: "Ready to revisit", value: projects.filter((project) => project.revisitLater).length, note: "Saved for reflection", icon: Clock3, color: "text-[#2b2100] bg-gradient-to-br from-[#fff098] to-[#ffd21c]" },
    { label: "Revived", value: projects.filter((project) => project.status === "reviving").length, note: "Back in motion", icon: HeartPulse, color: "text-[#192300] bg-gradient-to-br from-[#efffa3] to-[#b8ee36]" },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Your idea archive"
        title="Nothing good is ever truly buried."
        description="Every unfinished project still holds a useful story. Search the archive, notice what changed, and return when the timing feels right."
        action={<div className="flex flex-wrap gap-2"><Button type="button" variant="secondary" size="lg" onClick={() => setResetOpen(true)}><RotateCcw className="size-4" /> Reset demo</Button><Button asChild size="lg"><Link to="/projects/new"><Plus className="size-4" /> Preserve a project</Link></Button></div>}
      />
      <PageContainer>
        <aside className="mb-5 flex items-start gap-3 rounded-2xl border border-[#d8ff54]/15 bg-[#d8ff54]/[0.045] px-4 py-3 text-sm text-slate-400 shadow-[inset_0_1px_rgba(255,255,255,.04)]">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-[#d8ff54] shadow-[0_0_14px_rgba(216,255,84,.65)]" />
          <p><strong className="font-semibold text-slate-200">Guest archive:</strong> projects and changes stay only in this browser. No account or cloud sync is active.</p>
        </aside>
        <section className="grid gap-3 sm:grid-cols-3" aria-label="Archive overview">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="stat-card group">
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <span className={`stat-icon grid size-12 shrink-0 place-items-center rounded-2xl ${stat.color}`}><Icon className="size-5" /></span>
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
