import { useState } from "react";
import {
  Compass,
  Scissors,
  CheckCircle2,
  Clock,
  Sparkles,
  Zap,
  Check,
  ShieldCheck,
  Plus
} from "lucide-react";
import type {
  Project,
  BlockerRecheck,
  ScopeRevision,
  RevivalDecision,
  RevivalPath,
  TimelineEvent
} from "../../domain/project";
import { Button } from "../../components/ui/Button";
import { Card, CardContent, CardHeader } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

interface ReflectionStationProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
}

export function ReflectionStation({ project, onUpdateProject }: ReflectionStationProps) {
  const [activeTab, setActiveTab] = useState<"jumpstart" | "shrink" | "recheck" | "decision">("jumpstart");

  // Shrink the Dream state
  const [shrinkSelections, setShrinkSelections] = useState<Record<string, "keep" | "postpone" | "remove">>(() => {
    const initial: Record<string, "keep" | "postpone" | "remove"> = {};
    project.workItems.forEach((w) => {
      initial[w.id] = w.completed ? "keep" : "postpone";
    });
    return initial;
  });
  const [shrinkSaved, setShrinkSaved] = useState(false);

  // Blocker Recheck state
  const [recheckOutcome, setRecheckOutcome] = useState<"resolved" | "smaller" | "still-blocking">("resolved");
  const [recheckNote, setRecheckNote] = useState("");
  const [recheckSaved, setRecheckSaved] = useState(false);

  // Revival Decision state
  const [decisionPath, setDecisionPath] = useState<RevivalPath>("continue");
  const [decisionReason, setDecisionReason] = useState("");
  const [firstAction, setFirstAction] = useState("");
  const [decisionSaved, setDecisionSaved] = useState(false);

  // Jumpstart task completion toggle
  const handleToggleTask = (taskId: string) => {
    const updatedWorkItems = project.workItems.map((item) =>
      item.id === taskId ? { ...item, completed: !item.completed } : item
    );

    const now = new Date().toISOString();
    const targetItem = project.workItems.find((w) => w.id === taskId);
    const timelineEvent: TimelineEvent = {
      id: "event-" + Date.now(),
      type: "updated",
      title: "Completed work item",
      description: `Marked task “${targetItem?.text || ""}” as ${!targetItem?.completed ? "completed" : "unfinished"}.`,
      occurredAt: now,
    };

    onUpdateProject({
      ...project,
      workItems: updatedWorkItems,
      timeline: [...project.timeline, timelineEvent],
      updatedAt: now,
    });
  };

  // 1. Submit Shrink the Dream
  const handleSaveShrink = () => {
    const now = new Date().toISOString();
    const revisionItems = Object.entries(shrinkSelections).map(([workItemId, disposition]) => ({
      workItemId,
      disposition,
    }));

    const newRevision: ScopeRevision = {
      id: "rev-" + Date.now(),
      items: revisionItems,
      createdAt: now,
    };

    const keptCount = revisionItems.filter((i) => i.disposition === "keep").length;

    const timelineEvent: TimelineEvent = {
      id: "event-" + Date.now(),
      type: "scope-revised",
      title: "Shrunk the Dream (Scope Revised)",
      description: `Narrowed focus down to ${keptCount} essential tasks to eliminate overwhelm.`,
      occurredAt: now,
    };

    onUpdateProject({
      ...project,
      scopeRevisions: [...(project.scopeRevisions || []), newRevision],
      timeline: [...project.timeline, timelineEvent],
      updatedAt: now,
    });

    setShrinkSaved(true);
    setTimeout(() => setShrinkSaved(false), 3000);
  };

  // 2. Submit Blocker Recheck
  const handleSaveRecheck = () => {
    if (!recheckNote.trim()) return;

    const now = new Date().toISOString();
    const newRecheck: BlockerRecheck = {
      id: "recheck-" + Date.now(),
      outcome: recheckOutcome,
      whatChanged: recheckNote.trim(),
      createdAt: now,
    };

    const timelineEvent: TimelineEvent = {
      id: "event-" + Date.now(),
      type: "blocker-rechecked",
      title: `Blocker Recheck: ${recheckOutcome.toUpperCase()}`,
      description: recheckNote.trim(),
      occurredAt: now,
    };

    onUpdateProject({
      ...project,
      blockerRechecks: [...(project.blockerRechecks || []), newRecheck],
      timeline: [...project.timeline, timelineEvent],
      updatedAt: now,
    });

    setRecheckNote("");
    setRecheckSaved(true);
    setTimeout(() => setRecheckSaved(false), 3000);
  };

  // 3. Submit Revival Decision
  const handleSaveDecision = () => {
    if (!decisionReason.trim()) return;

    const now = new Date().toISOString();
    const newDecision: RevivalDecision = {
      id: "dec-" + Date.now(),
      path: decisionPath,
      reason: decisionReason.trim(),
      firstSmallAction: firstAction.trim() || undefined,
      createdAt: now,
    };

    const newStatus =
      decisionPath === "archive"
        ? "archived"
        : decisionPath === "continue" || decisionPath === "restart"
        ? "reviving"
        : project.status;

    const timelineEvent: TimelineEvent = {
      id: "event-" + Date.now(),
      type: "decision-made",
      title: `Decision Recorded: ${decisionPath.toUpperCase()}`,
      description: `${decisionReason.trim()}${firstAction.trim() ? ` — Next action: ${firstAction.trim()}` : ""}`,
      occurredAt: now,
    };

    onUpdateProject({
      ...project,
      status: newStatus,
      revivalDecisions: [...(project.revivalDecisions || []), newDecision],
      timeline: [...project.timeline, timelineEvent],
      updatedAt: now,
    });

    setDecisionReason("");
    setFirstAction("");
    setDecisionSaved(true);
    setTimeout(() => setDecisionSaved(false), 3000);
  };

  return (
    <Card className="border-indigo-100/90 bg-white shadow-xl shadow-slate-900/4">
      {/* Station Navigation Header */}
      <CardHeader className="border-b border-slate-100 pb-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E95420]">
              <Compass className="size-4" />
              <span>Project Reflection & Revival Station</span>
            </div>
            <h3 className="mt-1 font-display text-xl font-bold text-[#181D27]">
              Unstick This Sleeping Idea
            </h3>
          </div>

          <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100/90 p-1 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => setActiveTab("jumpstart")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                activeTab === "jumpstart"
                  ? "bg-white text-[#E95420] font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <Zap className="size-3.5" />
              <span>Jumpstart</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("shrink")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                activeTab === "shrink"
                  ? "bg-white text-[#E95420] font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <Scissors className="size-3.5" />
              <span>Shrink the Dream</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("recheck")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                activeTab === "recheck"
                  ? "bg-white text-[#E95420] font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <Clock className="size-3.5" />
              <span>Blocker Check</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("decision")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 transition-all ${
                activeTab === "decision"
                  ? "bg-white text-[#E95420] font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              <Sparkles className="size-3.5" />
              <span>Decide Next</span>
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-5">
        {/* TAB 1: 15-MINUTE JUMPSTART */}
        {activeTab === "jumpstart" && (
          <div className="space-y-4">
            <div className="rounded-xl border border-orange-200/70 bg-gradient-to-r from-orange-50/80 via-white to-amber-50/50 p-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#E95420]">
                Quick Momentum Re-Entry
              </span>
              <h4 className="mt-1 text-base font-bold text-[#181D27]">
                Suggested Next Step
              </h4>
              <p className="mt-1 text-sm text-slate-600">
                {project.memoryCapsule?.suggestedNextStep ||
                  project.workItems.find((w) => !w.completed)?.text ||
                  "Review the project intention and pick 1 small item to test today."}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Click to Mark Any Item Complete
              </h5>
              <div className="space-y-2">
                {project.workItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleTask(item.id)}
                    className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition ${
                      item.completed
                        ? "border-emerald-200 bg-emerald-50/50 text-slate-500"
                        : "border-slate-200 bg-white hover:border-[#E95420]/40 hover:bg-orange-50/20 text-[#181D27]"
                    }`}
                  >
                    <span className={`text-sm ${item.completed ? "line-through opacity-75" : "font-medium"}`}>
                      {item.text}
                    </span>
                    <span
                      className={`grid size-5 place-items-center rounded-md border ${
                        item.completed
                          ? "border-emerald-500 bg-emerald-500 text-white"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {item.completed && <Check className="size-3.5 stroke-[3]" />}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SHRINK THE DREAM */}
        {activeTab === "shrink" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Scissors className="size-4 text-[#E95420]" />
                Cut Scope to Overcome Overwhelm
              </h4>
              <p className="mt-1 text-xs text-slate-600 leading-relaxed">
                Most graveyard projects stalled because they were too ambitious. Mark only the 1 or 2 items essential for <strong>v0.1</strong>. Postpone or drop the rest to make this project immediately achievable.
              </p>
            </div>

            <div className="space-y-2.5">
              {project.workItems.map((item) => {
                const currentDisposition = shrinkSelections[item.id] || "postpone";
                return (
                  <div
                    key={item.id}
                    className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {item.text}
                    </span>

                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      {(["keep", "postpone", "remove"] as const).map((disp) => (
                        <button
                          key={disp}
                          type="button"
                          onClick={() =>
                            setShrinkSelections((prev) => ({
                              ...prev,
                              [item.id]: disp,
                            }))
                          }
                          className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition ${
                            currentDisposition === disp
                              ? disp === "keep"
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : disp === "postpone"
                                ? "bg-amber-500 text-white shadow-2xs"
                                : "bg-rose-500 text-white shadow-2xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                          }`}
                        >
                          {disp}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-500">
                Kept for v0.1:{" "}
                <strong>
                  {Object.values(shrinkSelections).filter((v) => v === "keep").length}
                </strong>{" "}
                items
              </span>
              <Button
                type="button"
                onClick={handleSaveShrink}
                className="bg-[#E95420] text-white hover:bg-[#C73E10]"
              >
                {shrinkSaved ? (
                  <>
                    <CheckCircle2 className="size-4" /> Scope Saved!
                  </>
                ) : (
                  <>
                    <Scissors className="size-4" /> Save Reduced Scope
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* TAB 3: BLOCKER RECHECK */}
        {activeTab === "recheck" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock className="size-4 text-[#E95420]" />
                Is this still a blocker today?
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                Recorded pause reason: <strong>{project.abandonmentReason}</strong>. Often new libraries, AI tools, or fresh skills mean an old blocker is now trivial to solve.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Current Reality Check
              </label>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                {[
                  { id: "resolved", label: "Blocker Resolved", desc: "No longer blocking" },
                  { id: "smaller", label: "Much Smaller Now", desc: "Can be worked around" },
                  { id: "still-blocking", label: "Still Blocking", desc: "Needs more time" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setRecheckOutcome(opt.id as typeof recheckOutcome)}
                    className={`rounded-xl border p-3 text-left transition ${
                      recheckOutcome === opt.id
                        ? "border-[#E95420] bg-orange-50/50 shadow-xs ring-1 ring-[#E95420]/30"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-800">
                      {opt.label}
                    </span>
                    <span className="text-[11px] text-slate-500">{opt.desc}</span>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  What changed since momentum stopped?
                </label>
                <textarea
                  value={recheckNote}
                  onChange={(e) => setRecheckNote(e.target.value)}
                  placeholder="e.g. A new API released, or I realized I can build it without backend auth..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleSaveRecheck}
                  disabled={!recheckNote.trim()}
                  className="bg-[#E95420] text-white hover:bg-[#C73E10]"
                >
                  {recheckSaved ? (
                    <>
                      <CheckCircle2 className="size-4" /> Recheck Recorded!
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" /> Record Blocker Recheck
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: REVIVAL DECISION */}
        {activeTab === "decision" && (
          <div className="space-y-4">
            <div className="rounded-xl bg-slate-50 border border-slate-200/80 p-4">
              <h4 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Sparkles className="size-4 text-[#E95420]" />
                Make an Intentional Decision
              </h4>
              <p className="mt-1 text-xs text-slate-600">
                End the lingering mental debt. Choose a clear direction for this project.
              </p>
            </div>

            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Select Path
              </label>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { id: "continue", label: "Revive & Continue", badge: "Reviving" },
                  { id: "restart", label: "Fresh Clean Start", badge: "Reviving" },
                  { id: "repurpose", label: "Repurpose Code", badge: "Paused" },
                  { id: "archive", label: "Peaceful Rest", badge: "Archived" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDecisionPath(opt.id as RevivalPath)}
                    className={`rounded-xl border p-2.5 text-left transition ${
                      decisionPath === opt.id
                        ? "border-[#E95420] bg-orange-50/50 shadow-xs ring-1 ring-[#E95420]/30"
                        : "border-slate-200 bg-white hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-xs font-bold text-slate-800">
                      {opt.label}
                    </span>
                    <Badge variant="neutral" className="mt-1 text-[10px]">
                      {opt.badge}
                    </Badge>
                  </button>
                ))}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Why this decision?
                </label>
                <input
                  type="text"
                  value={decisionReason}
                  onChange={(e) => setDecisionReason(e.target.value)}
                  placeholder="e.g. The core idea is still awesome and I now have the time..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  First small action (Optional)
                </label>
                <input
                  type="text"
                  value={firstAction}
                  onChange={(e) => setFirstAction(e.target.value)}
                  placeholder="e.g. Set up a fresh Vite template on Saturday morning..."
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden"
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="button"
                  onClick={handleSaveDecision}
                  disabled={!decisionReason.trim()}
                  className="bg-[#E95420] text-white hover:bg-[#C73E10]"
                >
                  {decisionSaved ? (
                    <>
                      <CheckCircle2 className="size-4" /> Decision Saved!
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" /> Record Revival Decision
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}