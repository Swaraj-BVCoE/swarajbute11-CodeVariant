import {
  Archive,
  FolderKanban,
  HeartPulse,
  Plus,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";

export type NavigationItem = {
  label: string;
  description: string;
  to: string;
  icon: LucideIcon;
};

export const navigationItems: NavigationItem[] = [
  { label: "All Projects", description: "Your sleeping ideas", to: "/", icon: FolderKanban },
  { label: "Add Project", description: "Preserve a project", to: "/projects/new", icon: Plus },
  { label: "Revisit Later", description: "Saved for reflection", to: "/revisit-later", icon: RotateCcw },
  { label: "Revived", description: "Ideas waking up", to: "/revived", icon: HeartPulse },
  { label: "Archived", description: "Resting indefinitely", to: "/archived", icon: Archive },
];
