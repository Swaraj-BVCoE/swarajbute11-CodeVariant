import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { GripVertical } from "lucide-react";
import { resolveCanvasDrop, type CanvasCardData, type CanvasZoneData, type CanvasZoneType } from "./canvasProtocol";

type DropFeedback = {
  zoneType: CanvasZoneType;
  state: "pending" | "success" | "error";
  message: string;
} | null;

type CanvasBoardContextValue = {
  activeCard: CanvasCardData | null;
  feedback: DropFeedback;
};

const CanvasBoardContext = createContext<CanvasBoardContextValue>({ activeCard: null, feedback: null });

// The board and its colocated hook form one public drag-and-drop boundary.
// eslint-disable-next-line react-refresh/only-export-components
export function useCanvasBoard() {
  return useContext(CanvasBoardContext);
}

export function CanvasBoard({
  children,
  onDrop,
}: {
  children: ReactNode;
  onDrop: (card: CanvasCardData, zone: CanvasZoneData) => boolean | Promise<boolean>;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 180, tolerance: 8 } }),
    useSensor(KeyboardSensor),
  );
  const [activeCard, setActiveCard] = useState<CanvasCardData | null>(null);
  const [feedback, setFeedback] = useState<DropFeedback>(null);

  const announcements = useMemo(() => ({
    onDragStart({ active }: DragStartEvent) {
      const card = active.data.current;
      return card?.label ? `Picked up ${String(card.label)}. Move to an action zone, then drop.` : "Card picked up.";
    },
    onDragOver({ active, over }: DragOverEvent) {
      const result = resolveCanvasDrop(active.data.current, over?.data.current);
      if (result.status === "accepted") return `${result.zone.label} is a valid destination.`;
      if (result.status === "rejected") return result.message;
      return "Not over an action zone.";
    },
    onDragEnd({ active, over }: DragEndEvent) {
      const result = resolveCanvasDrop(active.data.current, over?.data.current);
      if (result.status === "accepted") return `Dropped ${result.card.label} in ${result.zone.label}.`;
      return result.status === "rejected" ? result.message : "Drag cancelled. Nothing changed.";
    },
    onDragCancel() {
      return "Drag cancelled. Nothing changed.";
    },
  }), []);

  const handleDragStart = ({ active }: DragStartEvent) => {
    if (feedback?.state === "pending") return;
    const data = active.data.current;
    setActiveCard(data?.kind === "canvas-card" ? data as CanvasCardData : null);
    setFeedback(null);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    if (feedback?.state === "pending") return;
    const resolution = resolveCanvasDrop(active.data.current, over?.data.current);
    setActiveCard(null);
    if (resolution.status === "cancelled") return;
    if (resolution.status === "rejected") {
      const overZone = over?.data.current;
      if (overZone?.kind === "action-zone") {
        setFeedback({ zoneType: overZone.zoneType as CanvasZoneType, state: "error", message: resolution.message });
      }
      return;
    }

    setFeedback({ zoneType: resolution.zone.zoneType, state: "pending", message: `Applying ${resolution.zone.label}…` });
    try {
      const succeeded = await onDrop(resolution.card, resolution.zone);
      setFeedback({
        zoneType: resolution.zone.zoneType,
        state: succeeded ? "success" : "error",
        message: succeeded ? `${resolution.zone.label} completed.` : "Nothing was saved. Review the highlighted details and try again.",
      });
    } catch {
      setFeedback({ zoneType: resolution.zone.zoneType, state: "error", message: "The change could not be saved. Your card is still available." });
    }
  };

  return (
    <CanvasBoardContext.Provider value={{ activeCard, feedback }}>
      <DndContext
        sensors={sensors}
        accessibility={{
          announcements,
          screenReaderInstructions: {
            draggable: "To pick up a card, press space. Use arrow keys to move it to an action zone. Press space again to drop, or Escape to cancel.",
          },
        }}
        onDragStart={handleDragStart}
        onDragCancel={() => setActiveCard(null)}
        onDragEnd={handleDragEnd}
      >
        {children}
        <DragOverlay dropAnimation={null}>
          {activeCard ? (
            <div className="canvas-drag-overlay">
              <GripVertical className="size-4" />
              <span>{activeCard.label}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </CanvasBoardContext.Provider>
  );
}

