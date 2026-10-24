import { ArrowLeft, Construction, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";

type PlaceholderPanelProps = {
  checkpoint: number;
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function PlaceholderPanel({ checkpoint, title, description, children }: PlaceholderPanelProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-300/50 to-transparent" />
      <CardContent className="relative grid min-h-[24rem] place-items-center px-6 py-12 text-center">
        <div className="max-w-xl">
          <span className="mx-auto mb-5 grid size-14 place-items-center rounded-2xl border border-violet-300/15 bg-violet-400/10 text-violet-200">
            <Construction className="size-6" aria-hidden="true" />
          </span>
          <Badge variant="violet"><Sparkles className="size-3" /> Checkpoint {checkpoint}</Badge>
          <h2 className="mt-5 font-display text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400 sm:text-base">{description}</p>
          {children}
          <Button asChild variant="secondary" className="mt-7">
            <Link to="/"><ArrowLeft className="size-4" /> Back to archive</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
