import { FolderOpen, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export function ArchiveEmptyState({
  filtered,
  title,
  description,
  onReset,
}: {
  filtered: boolean;
  title: string;
  description: string;
  onReset: () => void;
}) {
  const Icon = filtered ? SearchX : FolderOpen;
  return (
    <Card className="col-span-full border-dashed border-[#D8D6CE] bg-[#FAF9F6]">
      <CardContent className="grid min-h-64 place-items-center py-12 text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-13 place-items-center rounded-2xl bg-[#EFECE5] text-[#606E54]">
            <Icon className="size-6" />
          </span>
          <h2 className="mt-4 font-display text-2xl font-medium text-[#252724]">{title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#5C605A]">{description}</p>
          {filtered ? (
            <Button type="button" variant="secondary" className="mt-5" onClick={onReset}>
              Reset filters
            </Button>
          ) : (
            <Button asChild className="mt-5">
              <Link to="/projects/new">Preserve a project</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
