import { Clock3, FolderOpen, HeartPulse, Plus, RotateCcw, Sparkles } from "lucide-react";
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
    {
      label: "Sleeping ideas",
      value: projects.filter((project) => project.status !== "archived").length,
      note: `${projects.length} total preserved`,
      icon: FolderOpen,
      iconBg: "bg-[#F3F2EE] text-[#606E54]",
    },
    {
      label: "Ready to revisit",
      value: projects.filter((project) => project.revisitLater).length,
      note: "Saved for reflection",
      icon: Clock3,
      iconBg: "bg-[#F8F4EC] text-[#9E7D4E]",
    },
    {
      label: "Revived",
      value: projects.filter((project) => project.status === "reviving").length,
      note: "Back in active motion",
      icon: HeartPulse,
      iconBg: "bg-[#EBF0E6] text-[#4A5740]",
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Your idea archive"
        title="Nothing good is ever truly buried."
        description="Every unfinished project still holds a valuable spark. Preserve context, notice what shifted, and return whenever the timing feels right."
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw className="size-4" /> Reset demo
            </Button>
            <Button asChild size="lg">
              <Link to="/projects/new">
                <Plus className="size-4" /> Preserve a project
              </Link>
            </Button>
          </div>
        }
      />

      <PageContainer>
        <aside className="mb-6 flex items-start gap-3 rounded-xl border border-[#D4DDD0] bg-[#F7F9F5] px-4 py-3 text-sm text-[#5C605A]">
          <span className="mt-1 size-2 shrink-0 rounded-full bg-[#606E54]" />
          <p className="leading-relaxed">
            <strong className="font-semibold text-[#252724]">Local & Private:</strong> This archive lives entirely in your browser. No external tracking, cloud sync, or account required.
          </p>
        </aside>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Archive overview">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="stat-card">
                <CardContent className="flex items-center gap-4 p-5">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${stat.iconBg}`}>
                    <Icon className="size-5" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <strong className="font-display text-2xl font-semibold text-[#252724]">
                        {stat.value}
                      </strong>
                      <span className="truncate text-sm font-semibold text-[#5C605A]">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-xs text-[#858780]">{stat.note}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <div className="mt-7">
          <ArchiveGrid
            projects={projects}
            emptyTitle="Your archive is empty"
            emptyDescription="Preserve an unfinished project to keep its story within reach."
          />
        </div>
      </PageContainer>

      <ResetDemoDataDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        onConfirm={resetDemoData}
      />
    </>
  );
}
