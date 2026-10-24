import React, { createContext, useContext, useEffect, useState, useTransition, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export type WindowId = "all-projects" | "add-project" | "project-details" | "edit-project" | "revisit" | "revived" | "archived" | "settings" | "terminal";

export interface DesktopWindowState {
  id: WindowId;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number; height: number };
  projectId?: string;
}

interface DesktopContextType {
  activeWorkspace: number;
  setActiveWorkspace: (ws: number) => void;
  windows: Record<WindowId, DesktopWindowState>;
  activeWindowId: WindowId | null;
  openWindow: (id: WindowId, options?: { projectId?: string; title?: string; syncRoute?: boolean }) => void;
  closeWindow: (id: WindowId) => void;
  minimizeWindow: (id: WindowId) => void;
  maximizeWindow: (id: WindowId) => void;
  restoreWindow: (id: WindowId) => void;
  focusWindow: (id: WindowId) => void;
  updatePosition: (id: WindowId, position: { x: number; y: number }) => void;
  wallpaper: string;
  setWallpaper: (wp: string) => void;
  dockPosition: "bottom" | "left";
  setDockPosition: (pos: "bottom" | "left") => void;
  launcherOpen: boolean;
  setLauncherOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const defaultWindows: Record<WindowId, DesktopWindowState> = {
  "all-projects": {
    id: "all-projects",
    title: "Project Vault ~ Files",
    isOpen: true,
    isMinimized: false,
    isMaximized: false,
    zIndex: 10,
    position: { x: 70, y: 55 },
    size: { width: 940, height: 680 },
  },
  "add-project": {
    id: "add-project",
    title: "Preserve New Project",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 120, y: 70 },
    size: { width: 780, height: 660 },
  },
  "project-details": {
    id: "project-details",
    title: "Project Capsule Inspector",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 12,
    position: { x: 160, y: 65 },
    size: { width: 920, height: 690 },
  },
  "edit-project": {
    id: "edit-project",
    title: "Edit Project Context",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 13,
    position: { x: 140, y: 80 },
    size: { width: 780, height: 660 },
  },
  "revisit": {
    id: "revisit",
    title: "Revisit Later ~ Reflection Desk",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 100, y: 75 },
    size: { width: 880, height: 640 },
  },
  "revived": {
    id: "revived",
    title: "Revived Projects ~ Pulse",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 110, y: 85 },
    size: { width: 880, height: 640 },
  },
  "archived": {
    id: "archived",
    title: "Long-term Archives ~ Vault",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 11,
    position: { x: 130, y: 95 },
    size: { width: 880, height: 640 },
  },
  "settings": {
    id: "settings",
    title: "Desktop Settings & Appearance",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 14,
    position: { x: 200, y: 110 },
    size: { width: 660, height: 540 },
  },
  "terminal": {
    id: "terminal",
    title: "graveyard-shell ~/projects",
    isOpen: false,
    isMinimized: false,
    isMaximized: false,
    zIndex: 15,
    position: { x: 180, y: 130 },
    size: { width: 720, height: 480 },
  },
};

const DesktopContext = createContext<DesktopContextType | null>(null);

export function DesktopProvider({ children }: { children: React.ReactNode }) {
  const [activeWorkspace, setActiveWorkspace] = useState(1);
  const [windows, setWindows] = useState<Record<WindowId, DesktopWindowState>>(defaultWindows);
  const [, setTopZ] = useState(20);
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>("all-projects");
  const [wallpaper, setWallpaper] = useState<string>(() => window.localStorage.getItem("project-graveyard:wallpaper") ?? "aurora-light");
  const [dockPosition, setDockPosition] = useState<"bottom" | "left">("bottom");
  const [launcherOpen, setLauncherOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();

  const focusWindow = useCallback((id: WindowId) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setWindows((prevWindows) => ({
        ...prevWindows,
        [id]: {
          ...prevWindows[id],
          zIndex: nextZ,
          isMinimized: false,
        },
      }));
      return nextZ;
    });
    setActiveWindowId(id);
  }, []);

  const openWindow = useCallback((id: WindowId, options?: { projectId?: string; title?: string; syncRoute?: boolean }) => {
    setTopZ((prev) => {
      const nextZ = prev + 1;
      setWindows((prevWindows) => ({
        ...prevWindows,
        [id]: {
          ...prevWindows[id],
          isOpen: true,
          isMinimized: false,
          zIndex: nextZ,
          projectId: options?.projectId ?? prevWindows[id].projectId,
          title: options?.title ?? prevWindows[id].title,
        },
      }));
      return nextZ;
    });
    setActiveWindowId(id);

    if (options?.syncRoute !== false) {
      const routes: Partial<Record<WindowId, string>> = {
        "all-projects": "/",
        "add-project": "/projects/new",
        "revisit": "/revisit-later",
        "revived": "/revived",
        "archived": "/archived",
      };
      const targetRoute = id === "project-details" && options?.projectId
        ? "/projects/" + options.projectId
        : id === "edit-project" && options?.projectId
          ? "/projects/" + options.projectId + "/edit"
          : routes[id];
      if (targetRoute) navigate(targetRoute);
    }
  }, [navigate]);

  const closeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isOpen: false,
        isMinimized: false,
      },
    }));

    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const remaining = Object.values(windows).filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
        if (remaining.length > 0) {
          const sorted = remaining.sort((a, b) => b.zIndex - a.zIndex);
          return sorted[0].id;
        }
        return null;
      }
      return prevActive;
    });

    if (id === "project-details" || id === "edit-project" || id === "add-project") {
      startTransition(() => {
        navigate("/", { replace: true });
      });
    }
  }, [navigate, windows]);

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMinimized: true,
      },
    }));

    setActiveWindowId((prevActive) => {
      if (prevActive === id) {
        const remaining = Object.values(windows).filter((w) => w.id !== id && w.isOpen && !w.isMinimized);
        if (remaining.length > 0) {
          const sorted = remaining.sort((a, b) => b.zIndex - a.zIndex);
          return sorted[0].id;
        }
        return null;
      }
      return prevActive;
    });
  }, [windows]);

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: !prev[id].isMaximized,
      },
    }));
    focusWindow(id);
  }, [focusWindow]);

  const restoreWindow = useCallback((id: WindowId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        isMaximized: false,
        isMinimized: false,
      },
    }));
    focusWindow(id);
  }, [focusWindow]);

  const updatePosition = useCallback((id: WindowId, position: { x: number; y: number }) => {
    setWindows((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        position,
      },
    }));
  }, []);

  useEffect(() => {
    window.localStorage.setItem("project-graveyard:wallpaper", wallpaper);
  }, [wallpaper]);

  // Sync route changes into window states using microtask queue to avoid cascading render lint issue
  useEffect(() => {
    const path = location.pathname;
    const timer = setTimeout(() => {
      if (path === "/") {
        openWindow("all-projects", { syncRoute: false });
      } else if (path === "/projects/new") {
        openWindow("add-project", { syncRoute: false });
      } else if (path.startsWith("/projects/") && path.endsWith("/edit")) {
        const pId = path.split("/")[2];
        openWindow("edit-project", { projectId: pId, syncRoute: false });
      } else if (path.startsWith("/projects/")) {
        const pId = path.split("/")[2];
        openWindow("project-details", { projectId: pId, syncRoute: false });
      } else if (path === "/revisit-later") {
        openWindow("revisit", { syncRoute: false });
      } else if (path === "/revived") {
        openWindow("revived", { syncRoute: false });
      } else if (path === "/archived") {
        openWindow("archived", { syncRoute: false });
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [location.pathname, openWindow]);

  return (
    <DesktopContext.Provider
      value={{
        activeWorkspace,
        setActiveWorkspace,
        windows,
        activeWindowId,
        openWindow,
        closeWindow,
        minimizeWindow,
        maximizeWindow,
        restoreWindow,
        focusWindow,
        updatePosition,
        wallpaper,
        setWallpaper,
        dockPosition,
        setDockPosition,
        launcherOpen,
        setLauncherOpen,
      }}
    >
      {children}
    </DesktopContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) {
    throw new Error("useDesktop must be used within a DesktopProvider");
  }
  return ctx;
}
