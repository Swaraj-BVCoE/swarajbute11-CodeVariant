import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { abandonmentReasonLabels, abandonmentReasons, projectStatuses, statusLabels } from "../../domain/project";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { defaultArchiveFilters, type ArchiveFilters } from "./projectFilters";

export function ArchiveToolbar({ filters, onChange, showStatus = true }: { filters: ArchiveFilters; onChange: (filters: ArchiveFilters) => void; showStatus?: boolean }) {
  const hasActiveFilters = Boolean(filters.query || filters.status !== "all" || filters.reason !== "all" || filters.sort !== "recent-activity");
  const reset = () => onChange({ ...defaultArchiveFilters });

  return (
    <Card>
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_repeat(3,minmax(10rem,auto))]">
          <label className="relative block">
            <span className="sr-only">Search projects</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-600" />
            <Input value={filters.query} onChange={(event) => onChange({ ...filters, query: event.target.value })} className="pl-10" placeholder="Search name, story, or technology…" />
            {filters.query && <button type="button" onClick={() => onChange({ ...filters, query: "" })} className="absolute right-2.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-slate-500 hover:bg-white/[0.06] hover:text-white" aria-label="Clear search"><X className="size-3.5" /></button>}
          </label>
          {showStatus && (
            <label><span className="sr-only">Filter by status</span><Select value={filters.status} onChange={(event) => onChange({ ...filters, status: event.target.value as ArchiveFilters["status"] })}><option value="all">All statuses</option>{projectStatuses.map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</Select></label>
          )}
          <label><span className="sr-only">Filter by abandonment reason</span><Select value={filters.reason} onChange={(event) => onChange({ ...filters, reason: event.target.value as ArchiveFilters["reason"] })}><option value="all">All pause reasons</option>{abandonmentReasons.map((reason) => <option key={reason} value={reason}>{abandonmentReasonLabels[reason]}</option>)}</Select></label>
          <label><span className="sr-only">Sort projects</span><Select value={filters.sort} onChange={(event) => onChange({ ...filters, sort: event.target.value as ArchiveFilters["sort"] })}><option value="recent-activity">Recent activity</option><option value="newest-created">Newest created</option><option value="oldest-created">Oldest created</option></Select></label>
        </div>
        <div className="mt-4 flex min-h-8 flex-wrap items-center gap-2">
          <span className="mr-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><SlidersHorizontal className="size-3.5" /> Active</span>
          {!hasActiveFilters && <span className="text-xs text-slate-600">No filters applied</span>}
          {filters.query && <Badge variant="violet">Search: “{filters.query}”</Badge>}
          {filters.status !== "all" && <Badge variant="violet">{statusLabels[filters.status]}</Badge>}
          {filters.reason !== "all" && <Badge variant="violet">{abandonmentReasonLabels[filters.reason]}</Badge>}
          {filters.sort !== "recent-activity" && <Badge variant="neutral">{filters.sort === "newest-created" ? "Newest created" : "Oldest created"}</Badge>}
          {hasActiveFilters && <Button type="button" variant="ghost" size="sm" className="ml-auto" onClick={reset}><RotateCcw className="size-3.5" /> Reset filters</Button>}
        </div>
      </CardContent>
    </Card>
  );
}
