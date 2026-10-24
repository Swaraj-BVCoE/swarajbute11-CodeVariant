import { FolderOpen, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card, CardContent } from "../../components/ui/Card";

export function ArchiveEmptyState({ filtered, title, description, onReset }: { filtered: boolean; title: string; description: string; onReset: () => void }) {
  const Icon = filtered ? SearchX : FolderOpen;
  return (
    <Card className="col-span-full">
      <CardContent className="grid min-h-72 place-items-center text-center">
        <div className="max-w-md">
          <span className="mx-auto grid size-16 place-items-center rounded-[1.4rem] border border-[#ff9c62]/20 bg-gradient-to-br from-[#ff6422]/20 to-[#ffd21c]/5 text-[#ffb183] shadow-[inset_0_1px_rgba(255,255,255,.1),0_18px_50px_rgba(255,100,34,.1)]"><Icon className="size-6" /></span>
          <h2 className="mt-5 font-display text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
          {filtered ? <Button type="button" variant="secondary" className="mt-6" onClick={onReset}>Reset filters</Button> : <Button asChild className="mt-6"><Link to="/projects/new">Preserve a project</Link></Button>}
        </div>
      </CardContent>
    </Card>
  );
}
