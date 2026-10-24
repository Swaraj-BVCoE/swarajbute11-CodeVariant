export const projectStatuses = ["paused", "revisit-later", "reviving", "archived"] as const;
export type ProjectStatus = (typeof projectStatuses)[number];

export const abandonmentReasons = [
  "lack-of-time",
  "technical-blocker",
  "scope-too-large",
  "lost-interest",
  "lack-of-resources",
  "changed-priorities",
  "other",
] as const;
export type AbandonmentReason = (typeof abandonmentReasons)[number];

export type WorkItem = {
  id: string;
  text: string;
  completed: boolean;
};

export type MemoryCapsule = {
  lastThingThatWorked?: string;
  exactStoppingPoint?: string;
  suggestedNextStep?: string;
  importantLinks: string[];
  noteToFutureSelf?: string;
};

export type BlockerRecheck = {
  id: string;
  outcome: "resolved" | "smaller" | "still-blocking";
  whatChanged: string;
  createdAt: string;
};

export type ScopeRevisionItem = {
  workItemId: string;
  disposition: "keep" | "postpone" | "remove";
};

export type ScopeRevision = {
  id: string;
  items: ScopeRevisionItem[];
  createdAt: string;
};

export type RevivalPath = "restart" | "continue" | "change-idea" | "repurpose" | "archive";

export type RevivalDecision = {
  id: string;
  path: RevivalPath;
  reason: string;
  firstSmallAction?: string;
  createdAt: string;
};

export type TimelineEventType =
  | "created"
  | "updated"
  | "paused"
  | "revisit-scheduled"
  | "blocker-rechecked"
  | "scope-revised"
  | "decision-made";

export type TimelineEvent = {
  id: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  occurredAt: string;
};

export type Project = {
  id: string;
  name: string;
  shortDescription: string;
  intendedOutcome: string;
  technologies: string[];
  repositoryUrl?: string;
  demoUrl?: string;
  workItems: WorkItem[];
  status: ProjectStatus;
  abandonmentReason: AbandonmentReason;
  abandonmentNotes?: string;
  startDate?: string;
  lastWorkedDate?: string;
  revisitLater: boolean;
  memoryCapsule?: MemoryCapsule;
  blockerRechecks: BlockerRecheck[];
  scopeRevisions: ScopeRevision[];
  revivalDecisions: RevivalDecision[];
  timeline: TimelineEvent[];
  createdAt: string;
  updatedAt: string;
};

export const statusLabels: Record<ProjectStatus, string> = {
  paused: "Paused",
  "revisit-later": "Revisit later",
  reviving: "Reviving",
  archived: "Archived",
};

export const abandonmentReasonLabels: Record<AbandonmentReason, string> = {
  "lack-of-time": "Lack of time",
  "technical-blocker": "Technical blocker",
  "scope-too-large": "Scope too large",
  "lost-interest": "Lost interest",
  "lack-of-resources": "Lack of resources",
  "changed-priorities": "Changed priorities",
  other: "Other",
};
