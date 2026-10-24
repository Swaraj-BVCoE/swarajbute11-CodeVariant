import { describe, expect, it, vi } from "vitest";
import { canDropCard, resolveCanvasDrop, type CanvasCardData, type CanvasZoneData } from "./canvasProtocol";

const draft: CanvasCardData = { kind: "canvas-card", cardType: "project-draft", cardId: "draft:create", label: "Project Draft" };
const project: CanvasCardData = { kind: "canvas-card", cardType: "project-record", cardId: "project:one", projectId: "one", label: "Project One" };
const saveZone: CanvasZoneData = { kind: "action-zone", zoneType: "save-to-archive", label: "Save to Archive" };
const revisitZone: CanvasZoneData = { kind: "action-zone", zoneType: "revisit-later", label: "Revisit Later" };

describe("Canvas Protocol drop rules", () => {
  it("allows only declared card and zone combinations", () => {
    expect(canDropCard(draft, saveZone)).toBe(true);
    expect(canDropCard(project, revisitZone)).toBe(true);
    expect(canDropCard(draft, revisitZone)).toBe(false);
  });

  it("treats a drag without a destination as cancellation", () => {
    expect(resolveCanvasDrop(project, undefined)).toEqual({ status: "cancelled" });
  });

  it("rejects incompatible drops before a mutation can run", () => {
    const mutation = vi.fn();
    const resolution = resolveCanvasDrop(draft, revisitZone);
    if (resolution.status === "accepted") mutation();
    expect(resolution.status).toBe("rejected");
    expect(mutation).not.toHaveBeenCalled();
  });

  it("resolves one valid completed drop to one executable action", () => {
    const mutation = vi.fn();
    const resolution = resolveCanvasDrop(project, revisitZone);
    if (resolution.status === "accepted") mutation(resolution.card.projectId);
    expect(mutation).toHaveBeenCalledTimes(1);
    expect(mutation).toHaveBeenCalledWith("one");
  });
});

