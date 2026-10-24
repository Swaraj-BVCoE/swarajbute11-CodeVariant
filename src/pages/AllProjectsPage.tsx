import { ArrowRight, Clock3, FolderOpen, HeartPulse, Plus, Search, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { PageContainer } from "../components/layout/PageContainer";
import { PageHeader } from "../components/layout/PageHeader";

const stats = [
  { label: "Sleeping ideas", value: "—", note: "Archive total", icon: FolderOpen, color: "text-violet-300 bg-violet-400/10" },
  { label: "Ready to revisit", value: "—", note: "Saved for later", icon: Clock3, color: "text-amber-300 bg-amber-400/10" },
  { label: "Revived", value: "—", note: "Back in motion", icon: HeartPulse, color: "text-emerald-300 bg-emerald-400/10" },
];

export function AllProjectsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Your idea archive"
        title="Welcome back to the graveyard."
        description="Every unfinished project still holds a useful story. Preserve the context now, then return when the timing feels right."
        action={<Button asChild size="lg"><Link to="/projects/new"><Plus className="size-4" /> Preserve a project</Link></Button>}
      />
      <PageContainer>
        <section className="grid gap-3 sm:grid-cols-3" aria-label="Archive overview">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="group transition-transform duration-300 hover:-translate-y-0.5">
                <CardContent className="flex items-center gap-4 p-4 sm:p-5">
                  <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${stat.color}`}><Icon className="size-5" /></span>
                  <div className="min-w-0">
                    <div className="flex items-baseline gap-2"><strong className="font-display text-2xl text-white">{stat.value}</strong><span className="truncate text-sm font-semibold text-slate-300">{stat.label}</span></div>
                    <p className="text-xs text-slate-600">{stat.note} · available in Checkpoint 2</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(19rem,.65fr)]">
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <h2 className="font-display text-xl font-bold text-white">All projects</h2>
                <p className="mt-1 text-sm text-slate-500">Search and filters activate with archive data in Checkpoint 2.</p>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
                <Input aria-label="Search projects (coming in Checkpoint 2)" className="pl-10" disabled placeholder="Search sleeping ideas…" />
              </div>
            </div>
            <CardContent className="grid min-h-[25rem] place-items-center px-6 py-12 text-center">
              <div className="max-w-md">
                <span className="mx-auto grid size-16 place-items-center rounded-[1.25rem] border border-violet-300/15 bg-violet-400/[0.08] text-violet-200 shadow-[0_0_60px_rgba(124,92,255,.08)]">
                  <FolderOpen className="size-7" />
                </span>
                <Badge variant="neutral" className="mt-5">Foundation preview</Badge>
                <h3 className="mt-4 font-display text-2xl font-bold tracking-tight text-white">Your first idea is worth remembering.</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">The complete project form arrives in Checkpoint 3. For now, explore the navigation and the visual foundation.</p>
                <Button asChild className="mt-6"><Link to="/projects/new"><Plus className="size-4" /> Open add-project route</Link></Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="overflow-hidden border-violet-300/15 bg-gradient-to-br from-violet-400/[0.12] via-[var(--color-surface)] to-[var(--color-surface)]">
              <CardContent>
                <span className="grid size-10 place-items-center rounded-xl bg-violet-300/10 text-violet-200"><Sparkles className="size-5" /></span>
                <p className="mt-6 text-xs font-bold uppercase tracking-[0.18em] text-violet-300">The ritual</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">Remember. Reconsider. Revive.</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">Capture where you stopped, recheck the blocker, shrink the dream, and choose an honest next step.</p>
                <Link to="/projects/demo" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-200 hover:text-violet-100">Preview details route <ArrowRight className="size-4" /></Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-300">A gentler archive</p>
                <blockquote className="mt-3 font-display text-lg font-semibold leading-7 text-slate-200">“Unfinished doesn’t mean forgotten.”</blockquote>
                <p className="mt-3 text-sm leading-6 text-slate-500">No streaks. No guilt. Just enough context to make a better decision later.</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </PageContainer>
    </>
  );
}
