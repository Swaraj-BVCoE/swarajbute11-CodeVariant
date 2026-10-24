import { Archive, Clock3, HeartPulse, PauseCircle } from "lucide-react";
import type { ProjectStatus } from "../../domain/project";
import { statusLabels } from "../../domain/project";
import { Badge } from "../../components/ui/Badge";

const statusConfig = {
  paused: { icon: PauseCircle, variant: "neutral" as const },
  "revisit-later": { icon: Clock3, variant: "amber" as const },
  reviving: { icon: HeartPulse, variant: "emerald" as const },
  archived: { icon: Archive, variant: "violet" as const },
};

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const config = statusConfig[status];
  const Icon = config.icon;
  return (
    <Badge variant={config.variant}>
      <Icon className="size-3" />
      <span>{statusLabels[status]}</span>
    </Badge>
  );
}
