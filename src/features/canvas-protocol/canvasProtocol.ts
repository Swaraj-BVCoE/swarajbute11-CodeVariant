export const canvasCardTypes = ["project-draft", "project-record"] as const;
export type CanvasCardType = (typeof canvasCardTypes)[number];

export const canvasZoneTypes = ["save-to-archive", "revisit-later", "return-to-collection"] as const;
export type CanvasZoneType = (typeof canvasZoneTypes)[number];

export type CanvasCardData = {
  kind: "canvas-card";
  cardType: CanvasCardType;
  cardId: string;
  label: string;
  projectId?: string;
};

export type CanvasZoneData = {
  kind: "action-zone";
  zoneType: CanvasZoneType;
  label: string;
};

const allowedDrops: Record<CanvasCardType, readonly CanvasZoneType[]> = {
  "project-draft": ["save-to-archive"],
  "project-record": ["revisit-later", "return-to-collection"],
};

export function isCanvasCardData(value: unknown): value is CanvasCardData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CanvasCardData>;
  return candidate.kind === "canvas-card"
    && typeof candidate.cardId === "string"
    && typeof candidate.label === "string"
    && canvasCardTypes.includes(candidate.cardType as CanvasCardType);
}

export function isCanvasZoneData(value: unknown): value is CanvasZoneData {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<CanvasZoneData>;
  return candidate.kind === "action-zone"
    && typeof candidate.label === "string"
    && canvasZoneTypes.includes(candidate.zoneType as CanvasZoneType);
}

export function canDropCard(card: CanvasCardData, zone: CanvasZoneData) {
  return allowedDrops[card.cardType].includes(zone.zoneType);
}

export type DropResolution =
  | { status: "cancelled" }
  | { status: "rejected"; message: string }
  | { status: "accepted"; card: CanvasCardData; zone: CanvasZoneData };

export function resolveCanvasDrop(activeData: unknown, overData: unknown): DropResolution {
  if (!overData) return { status: "cancelled" };
  if (!isCanvasCardData(activeData) || !isCanvasZoneData(overData)) {
    return { status: "rejected", message: "That card and destination are not compatible." };
  }
  if (!canDropCard(activeData, overData)) {
    return { status: "rejected", message: `${activeData.label} cannot be dropped in ${overData.label}.` };
  }
  return { status: "accepted", card: activeData, zone: overData };
}

