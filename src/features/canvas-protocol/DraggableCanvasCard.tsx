import { useDraggable } from "@dnd-kit/core";
import { GripVertical } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "../../lib/utils";
import type { CanvasCardData } from "./canvasProtocol";
import { useCanvasBoard } from "./CanvasBoard";

export function DraggableCanvasCard({
  data,
  children,
  className,
  handleLabel,
}: {
  data: CanvasCardData;
  children: ReactNode;
  className?: string;
  handleLabel?: string;
}) {
  const { feedback } = useCanvasBoard();
  const pending = feedback?.state === "pending";
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: data.cardId, data, disabled: pending });
  const style: CSSProperties | undefined = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={cn("canvas-card", isDragging && "canvas-card-dragging", className)}
      data-canvas-card={data.cardType}
    >
      <button
        type="button"
        className="canvas-drag-handle"
        aria-label={handleLabel ?? `Drag ${data.label}`}
        disabled={pending}
        {...listeners}
        {...attributes}
      >
        <GripVertical className="size-4" />
        <span>Drag card</span>
      </button>
      {children}
    </article>
  );
}

