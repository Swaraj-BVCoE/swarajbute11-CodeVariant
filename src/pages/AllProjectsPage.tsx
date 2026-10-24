import { Clock3, FolderOpen, HeartPulse, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArchiveGrid } from "../features/archive/ArchiveGrid";
import { ResetDemoDataDialog } from "../features/archive/ResetDemoDataDialog";
import { useArchive } from "../features/archive/ArchiveContext";
import { Button } from "../components/ui/Button";
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
        eyebrow="3D Interactive Idea Archive"
        title="Nothing good is ever truly buried."
        description="Every unfinished project still holds a valuable spark. Revisit dormant creations, rotate the 3D memory artifacts, and revive them when inspiration strikes."
        show3DScene={true}
        action={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              type="button"
              variant="secondary"
              size="lg"
              className="border-slate-200/80 bg-white/80 backdrop-blur-md hover:bg-white hover:shadow-md"
              onClick={() => setResetOpen(true)}
            >
              <RotateCcw className="size-4 text-slate-600" /> Reset demo
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-indigo-500/35 active:scale-[0.98]"
            >
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
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            const glowStyles = [
              {
                border: "border-indigo-100",
                badgeBg: "bg-indigo-50 text-indigo-600 shadow-xs shadow-indigo-100",
                gradient: "from-indigo-500/10 via-purple-500/5 to-transparent",
                colorText: "text-indigo-600",
                glow: "indigo" as const,
              },
              {
                border: "border-amber-100",
                badgeBg: "bg-amber-50 text-amber-600 shadow-xs shadow-amber-100",
                gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
                colorText: "text-amber-600",
                glow: "amber" as const,
              },
              {
                border: "border-emerald-100",
                badgeBg: "bg-emerald-50 text-emerald-600 shadow-xs shadow-emerald-100",
                gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
                colorText: "text-emerald-600",
                glow: "emerald" as const,
              },
            ][idx];

            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-lg shadow-slate-200/50 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className={`pointer-events-none absolute -right-6 -top-6 size-28 rounded-full bg-gradient-to-br ${glowStyles.gradient} blur-xl`} />
                <div className="flex items-center gap-4">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-xl ${glowStyles.badgeBg} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
                    <Icon className="size-6" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2">
                      <strong className="font-display text-2xl font-bold tracking-tight text-[#252724]">
                        {stat.value}
                      </strong>
                      <span className="truncate text-sm font-semibold text-[#5C605A]">
                        {stat.label}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-[#858780]">{stat.note}</p>
                  </div>
                </div>
              </div>
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
