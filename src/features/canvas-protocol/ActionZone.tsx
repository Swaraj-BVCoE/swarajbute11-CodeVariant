import { useDroppable } from "@dnd-kit/core";
import { ArchiveRestore, BookmarkPlus, CheckCircle2, LoaderCircle, RotateCcw, TriangleAlert } from "lucide-react";
import { cn } from "../../lib/utils";
import { canDropCard, type CanvasZoneData } from "./canvasProtocol";
import { useCanvasBoard } from "./CanvasBoard";

const zoneIcons = {
  "save-to-archive": ArchiveRestore,
  "revisit-later": BookmarkPlus,
  "return-to-collection": RotateCcw,
};

export function ActionZone({ data, instruction }: { data: CanvasZoneData; instruction: string }) {
  const { activeCard, feedback } = useCanvasBoard();
  const { isOver, setNodeRef } = useDroppable({ id: `zone:${data.zoneType}`, data });
  const valid = activeCard ? canDropCard(activeCard, data) : null;
  const currentFeedback = feedback?.zoneType === data.zoneType ? feedback : null;
  const Icon = zoneIcons[data.zoneType];
  const state = currentFeedback?.state ?? (isOver ? (valid ? "valid" : "invalid") : activeCard ? (valid ? "ready" : "invalid") : "idle");

  return (
    <section ref={setNodeRef} className={cn("canvas-action-zone", `canvas-action-zone-${state}`)} aria-label={`${data.label}. ${instruction}`}>
      <span className="canvas-zone-icon">
        {state === "pending" ? <LoaderCircle className="size-5 animate-spin" />
          : state === "success" ? <CheckCircle2 className="size-5" />
          : state === "invalid" ? <TriangleAlert className="size-5" />
          : <Icon className="size-5" />}
      </span>
      <span className="min-w-0">
        <strong>{data.label}</strong>
        <small>{currentFeedback?.message ?? instruction}</small>
      </span>
    </section>
  );
}

