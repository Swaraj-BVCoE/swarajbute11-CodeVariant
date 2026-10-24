import { RotateCcw, Search, SlidersHorizontal, X } from "lucide-react";
import { abandonmentReasonLabels, abandonmentReasons, projectStatuses, statusLabels } from "../../domain/project";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Select } from "../../components/ui/Select";
import { defaultArchiveFilters, type ArchiveFilters } from "./projectFilters";

export function ArchiveToolbar({
  filters,
  onChange,
  showStatus = true,
}: {
  filters: ArchiveFilters;
  onChange: (filters: ArchiveFilters) => void;
  showStatus?: boolean;
}) {
  const hasActiveFilters = Boolean(
    filters.query || filters.status !== "all" || filters.reason !== "all" || filters.sort !== "recent-activity",
  );
  const reset = () => onChange({ ...defaultArchiveFilters });

  return (
    <Card className="shadow-xs">
      <CardContent className="p-4 sm:p-5">
        <div className="grid gap-3 lg:grid-cols-[minmax(16rem,1fr)_repeat(3,minmax(10.5rem,auto))]">
          <label className="relative block">
            <span className="sr-only">Search projects</span>
            <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#858780]" />
            <Input
              value={filters.query}
              onChange={(event) => onChange({ ...filters, query: event.target.value })}
              className="pl-10"
              placeholder="Search by title, technology, or intention…"
            />
            {filters.query && (
              <button
                type="button"
                onClick={() => onChange({ ...filters, query: "" })}
                className="absolute right-2.5 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded text-[#858780] hover:bg-[#F3F2EE] hover:text-[#252724]"
                aria-label="Clear search"
              >
                <X className="size-3.5" />
              </button>
            )}
          </label>

          {showStatus && (
            <label>
              <span className="sr-only">Filter by status</span>
              <Select
                value={filters.status}
                onChange={(event) => onChange({ ...filters, status: event.target.value as ArchiveFilters["status"] })}
              >
                <option value="all">All statuses</option>
                {projectStatuses.map((status) => (
                  <option key={status} value={status}>
                    {statusLabels[status]}
                  </option>
                ))}
              </Select>
            </label>
          )}

          <label>
            <span className="sr-only">Filter by abandonment reason</span>
            <Select
              value={filters.reason}
              onChange={(event) => onChange({ ...filters, reason: event.target.value as ArchiveFilters["reason"] })}
            >
              <option value="all">All pause reasons</option>
              {abandonmentReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {abandonmentReasonLabels[reason]}
                </option>
              ))}
            </Select>
          </label>

          <label>
            <span className="sr-only">Sort projects</span>
            <Select
              value={filters.sort}
              onChange={(event) => onChange({ ...filters, sort: event.target.value as ArchiveFilters["sort"] })}
            >
              <option value="recent-activity">Recent activity</option>
              <option value="newest-created">Newest created</option>
              <option value="oldest-created">Oldest created</option>
            </Select>
          </label>
        </div>

        <div className="mt-3.5 flex min-h-7 flex-wrap items-center gap-2 border-t border-[#F3F2EE] pt-3">
          <span className="mr-1 flex items-center gap-1.5 text-xs font-medium text-[#858780]">
            <SlidersHorizontal className="size-3" /> Filters:
          </span>
          {!hasActiveFilters && <span className="text-xs text-[#858780]">Showing all records</span>}
          {filters.query && <Badge variant="violet">Search: “{filters.query}”</Badge>}
          {filters.status !== "all" && <Badge variant="emerald">{statusLabels[filters.status]}</Badge>}
          {filters.reason !== "all" && <Badge variant="amber">{abandonmentReasonLabels[filters.reason]}</Badge>}
          {filters.sort !== "recent-activity" && (
            <Badge variant="neutral">
              {filters.sort === "newest-created" ? "Newest created" : "Oldest created"}
            </Badge>
          )}
          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" className="ml-auto h-7 px-2.5 text-xs" onClick={reset}>
              <RotateCcw className="size-3" /> Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
