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
    <Card className="relative overflow-hidden bg-[#FFFFFF]">
      <CardContent className="relative grid min-h-[22rem] place-items-center px-6 py-12 text-center">
        <div className="max-w-xl">
          <span className="mx-auto mb-4 grid size-12 place-items-center rounded-2xl bg-[#EBF0E6] text-[#606E54]">
            <Construction className="size-5" aria-hidden="true" />
          </span>
          <Badge variant="emerald">
            <Sparkles className="size-3" /> Checkpoint {checkpoint}
          </Badge>
          <h2 className="mt-4 font-display text-2xl font-medium tracking-tight text-[#252724] sm:text-3xl">
            {title}
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-[#5C605A] sm:text-base">
            {description}
          </p>
          {children}
          <Button asChild variant="secondary" className="mt-6">
            <Link to="/">
              <ArrowLeft className="size-4" /> Back to archive
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
