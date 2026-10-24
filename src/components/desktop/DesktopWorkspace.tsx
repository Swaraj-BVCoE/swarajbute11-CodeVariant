import React, { useState } from "react";
import {
  FolderKanban,
  Plus,
  RotateCcw,
  HeartPulse,
  Archive,
  Settings,
  Terminal,
  Sparkles,
  Layers
} from "lucide-react";
import { useDesktop } from "./DesktopContext";
import { useArchive } from "../../features/archive/ArchiveContext";
import { DesktopTopPanel } from "./DesktopTopPanel";
import { DesktopDock } from "./DesktopDock";
import { DesktopShortcuts } from "./DesktopShortcuts";
import { DesktopWindow } from "./DesktopWindow";
import { DesktopLauncher } from "./DesktopLauncher";
import { DesktopSettings } from "./DesktopSettings";
import { DesktopTerminal } from "./DesktopTerminal";

// Existing pages wrapped cleanly inside windows
import { AllProjectsPage } from "../../pages/AllProjectsPage";
import { AddProjectPage } from "../../pages/AddProjectPage";
import { ProjectDetailsPage } from "../../pages/ProjectDetailsPage";
import { EditProjectPage } from "../../pages/EditProjectPage";
import { RevisitLaterPage } from "../../pages/RevisitLaterPage";
import { RevivedProjectsPage } from "../../pages/RevivedProjectsPage";
import { ArchivedProjectsPage } from "../../pages/ArchivedProjectsPage";
import { Floating3DCanvas } from "../3d/Floating3DCanvas";
import { Notice } from "../ui/Notice";

export function DesktopWorkspace() {
  const {
    windows,
    wallpaper,
    activeWorkspace,
    setActiveWorkspace,
    openWindow
  } = useDesktop();
  const { notice, dismissNotice } = useArchive();

  // Desktop right-click context menu
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);

  const handleContextMenu = (e: React.MouseEvent) => {
    // Only open context menu on the desktop background itself
    if ((e.target as HTMLElement).closest(".group\\/win") || (e.target as HTMLElement).closest("nav") || (e.target as HTMLElement).closest("header")) {
      return;
    }
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  const closeContextMenu = () => {
    if (contextMenu) setContextMenu(null);
  };

  // Dynamic wallpaper styling
  const getWallpaperBackground = () => {
    switch (wallpaper) {
      case "alpine-breeze":
        return "bg-gradient-to-br from-[#EBF5EE] via-[#F4F9F5] to-[#E2EFE7]";
      case "electric-sunset":
        return "bg-gradient-to-br from-[#FDF2F4] via-[#FBF5FF] to-[#EFF4FE]";
      case "clean-slate":
        return "bg-gradient-to-br from-[#F5F5F7] via-[#FAFAFC] to-[#EDEDF2]";
      case "aurora-light":
      default:
        return "bg-gradient-to-br from-[#FAF9F6] via-[#F7F5EE] to-[#EEF2F6]";
    }
  };

  return (
    <div
      className={`relative h-screen w-screen overflow-hidden select-none ${getWallpaperBackground()}`}
      onContextMenu={handleContextMenu}
      onClick={closeContextMenu}
    >
      {/* 3D Interactive Ambient Particles Background */}
      <Floating3DCanvas />

      {/* Decorative desktop ambient aura lights */}
      <div className="pointer-events-none absolute -top-40 -left-40 size-[500px] rounded-full bg-indigo-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 size-[500px] rounded-full bg-purple-400/10 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[600px] rounded-full bg-cyan-400/5 blur-[140px]" />

      {/* Top Linux System Bar */}
      <DesktopTopPanel />

      {/* Desktop Main Workspace Area */}
      <div className="relative h-[calc(100vh-32px)] w-full overflow-hidden">
        {/* Workspace 1: Project Vault & Active Management */}
        {activeWorkspace === 1 && (
          <>
            {/* Desktop Shortcuts / Icons */}
            <DesktopShortcuts />

            {/* Window 1: All Projects (Main Project Graveyard Window) */}
            <DesktopWindow
              id="all-projects"
              title="Project Graveyard Vault"
              subtitle="All Sleeping & Active Projects"
              icon={<FolderKanban className="size-4 text-indigo-600" />}
            >
              <div className="min-h-full pb-16">
                <AllProjectsPage />
              </div>
            </DesktopWindow>

            {/* Window 2: Add Project Form */}
            <DesktopWindow
              id="add-project"
              title="Preserve Project"
              subtitle="Leave a Clean Handoff"
              icon={<Plus className="size-4 text-purple-600" />}
            >
              <div className="min-h-full pb-16">
                <AddProjectPage />
              </div>
            </DesktopWindow>

            {/* Window 3: Project Details Capsule Inspector */}
            <DesktopWindow
              id="project-details"
              title={windows["project-details"].title || "Project Capsule Inspector"}
              subtitle="3D Artifact & Progress"
              icon={<Sparkles className="size-4 text-cyan-600" />}
            >
              <div className="min-h-full pb-16">
                <ProjectDetailsPage />
              </div>
            </DesktopWindow>

            {/* Window 4: Edit Project Form */}
            <DesktopWindow
              id="edit-project"
              title="Edit Project Context"
              subtitle="Update Record"
              icon={<Plus className="size-4 text-purple-600" />}
            >
              <div className="min-h-full pb-16">
                <EditProjectPage />
              </div>
            </DesktopWindow>

            {/* Window 5: Revisit Later Window */}
            <DesktopWindow
              id="revisit"
              title="Revisit Later Desk"
              subtitle="Reflection & Notes"
              icon={<RotateCcw className="size-4 text-amber-600" />}
            >
              <div className="min-h-full pb-16">
                <RevisitLaterPage />
              </div>
            </DesktopWindow>

            {/* Window 6: Revived Projects Window */}
            <DesktopWindow
              id="revived"
              title="Revived Projects Pulse"
              subtitle="Ideas Back in Motion"
              icon={<HeartPulse className="size-4 text-emerald-600" />}
            >
              <div className="min-h-full pb-16">
                <RevivedProjectsPage />
              </div>
            </DesktopWindow>

            {/* Window 7: Long-Term Archive Window */}
            <DesktopWindow
              id="archived"
              title="Resting Archives"
              subtitle="Completed / Peacefully Archived"
              icon={<Archive className="size-4 text-rose-600" />}
            >
              <div className="min-h-full pb-16">
                <ArchivedProjectsPage />
              </div>
            </DesktopWindow>

            {/* Window 8: Desktop Appearance & Settings */}
            <DesktopWindow
              id="settings"
              title="Desktop Preferences"
              subtitle="Wallpapers & System"
              icon={<Settings className="size-4 text-cyan-600" />}
            >
              <DesktopSettings />
            </DesktopWindow>

            {/* Window 9: Interactive Linux Terminal */}
            <DesktopWindow
              id="terminal"
              title="graveyard-shell ~/projects"
              subtitle="Bash CLI Interface"
              icon={<Terminal className="size-4 text-slate-800" />}
            >
              <DesktopTerminal />
            </DesktopWindow>
          </>
        )}

        {/* Workspace 2: Clean Studio & Focus Environment */}
        {activeWorkspace === 2 && (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="flex size-20 items-center justify-center rounded-3xl border border-white/80 bg-white/80 shadow-xl backdrop-blur-xl mb-4">
              <Layers className="size-10 text-indigo-600" />
            </div>
            <h2 className="font-display text-3xl font-bold text-[#252724]">
              Workspace 2: Deep Focus Studio
            </h2>
            <p className="mt-2 max-w-md text-sm text-slate-600">
              A distraction-free Linux virtual desktop workspace. Switch back to Workspace 1 to view your open windows, or launch a focused utility here.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setActiveWorkspace(1)}
                className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md transition hover:bg-indigo-700"
              >
                Return to Workspace 1
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveWorkspace(1);
                  openWindow("terminal");
                }}
                className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                Open Terminal Shell
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Linux Desktop Dock */}
      <DesktopDock />

      {/* GNOME / KDE Application Launcher */}
      <DesktopLauncher />

      {/* Desktop Context Menu (Right Click) */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          className="fixed z-50 w-56 rounded-2xl border border-white/80 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl text-xs font-medium text-[#252724]"
        >
          <button
            type="button"
            onClick={() => {
              openWindow("add-project");
              closeContextMenu();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <Plus className="size-4" /> Preserve New Project
          </button>
          <button
            type="button"
            onClick={() => {
              openWindow("all-projects");
              closeContextMenu();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <FolderKanban className="size-4" /> Open Project Vault
          </button>
          <button
            type="button"
            onClick={() => {
              openWindow("terminal");
              closeContextMenu();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <Terminal className="size-4" /> Open Shell Terminal
          </button>
          <div className="h-px bg-slate-200/80 my-1" />
          <button
            type="button"
            onClick={() => {
              openWindow("settings");
              closeContextMenu();
            }}
            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            <Settings className="size-4" /> Change Wallpaper & Settings
          </button>
        </div>
      )}

      {/* System Toast Notification */}
      {notice && (
        <Notice type={notice.type} message={notice.message} onDismiss={dismissNotice} />
      )}
    </div>
  );
}
