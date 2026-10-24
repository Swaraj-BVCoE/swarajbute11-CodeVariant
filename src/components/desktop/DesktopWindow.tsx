import React, { useRef, useState, useEffect } from "react";
import {
  Minus,
  Square,
  X
} from "lucide-react";
import { useDesktop, type WindowId } from "./DesktopContext";

interface DesktopWindowProps {
  id: WindowId;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
}

type ResizeDirection = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

export function DesktopWindow({
  id,
  title,
  subtitle,
  icon,
  children,
}: DesktopWindowProps) {
  const {
    windows,
    activeWindowId,
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    updatePosition,
    updateBounds
  } = useDesktop();

  const win = windows[id];
  const isFocused = activeWindowId === id;

  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ startX: number; startY: number; posX: number; posY: number }>({
    startX: 0,
    startY: 0,
    posX: win?.position.x ?? 80,
    posY: win?.position.y ?? 60,
  });

  // Manual resizing state
  const [resizingDir, setResizingDir] = useState<ResizeDirection | null>(null);
  const resizeStartRef = useRef<{
    startX: number;
    startY: number;
    posX: number;
    posY: number;
    width: number;
    height: number;
  }>({
    startX: 0,
    startY: 0,
    posX: win?.position.x ?? 80,
    posY: win?.position.y ?? 60,
    width: win?.size.width ?? 800,
    height: win?.size.height ?? 600,
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) {
      return;
    }
    focusWindow(id);
    if (win?.isMaximized) return;

    setIsDragging(true);
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: win?.position.x ?? 80,
      posY: win?.position.y ?? 60,
    };
  };

  const handleResizeStart = (e: React.MouseEvent, dir: ResizeDirection) => {
    e.preventDefault();
    e.stopPropagation();
    focusWindow(id);
    if (win?.isMaximized) return;

    setResizingDir(dir);
    resizeStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      posX: win?.position.x ?? 80,
      posY: win?.position.y ?? 60,
      width: win?.size.width ?? 800,
      height: win?.size.height ?? 600,
    };
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const nextX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.posX + dx));
      const nextY = Math.max(34, Math.min(window.innerHeight - 150, dragStartRef.current.posY + dy));
      updatePosition(id, { x: nextX, y: nextY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, id, updatePosition]);

  // Window manual scaling listener
  useEffect(() => {
    if (!resizingDir) return;

    const minWidth = 420;
    const minHeight = 320;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - resizeStartRef.current.startX;
      const dy = e.clientY - resizeStartRef.current.startY;

      let newWidth = resizeStartRef.current.width;
      let newHeight = resizeStartRef.current.height;
      let newX = resizeStartRef.current.posX;
      let newY = resizeStartRef.current.posY;

      if (resizingDir.includes("e")) {
        newWidth = Math.max(minWidth, Math.min(window.innerWidth - newX - 10, resizeStartRef.current.width + dx));
      }
      if (resizingDir.includes("s")) {
        newHeight = Math.max(minHeight, Math.min(window.innerHeight - newY - 40, resizeStartRef.current.height + dy));
      }
      if (resizingDir.includes("w")) {
        const potentialWidth = resizeStartRef.current.width - dx;
        if (potentialWidth >= minWidth) {
          newWidth = potentialWidth;
          newX = resizeStartRef.current.posX + dx;
        } else {
          newWidth = minWidth;
          newX = resizeStartRef.current.posX + (resizeStartRef.current.width - minWidth);
        }
      }
      if (resizingDir.includes("n")) {
        const potentialHeight = resizeStartRef.current.height - dy;
        if (potentialHeight >= minHeight) {
          newHeight = potentialHeight;
          newY = Math.max(34, resizeStartRef.current.posY + dy);
        } else {
          newHeight = minHeight;
          newY = resizeStartRef.current.posY + (resizeStartRef.current.height - minHeight);
        }
      }

      updateBounds(id, {
        position: { x: Math.max(0, newX), y: Math.max(34, newY) },
        size: { width: newWidth, height: newHeight },
      });
    };

    const handleMouseUp = () => {
      setResizingDir(null);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [resizingDir, id, updateBounds]);

  if (!win || !win.isOpen || win.isMinimized) {
    return null;
  }

  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: "fixed",
        top: "44px",
        left: "0px",
        width: "100vw",
        height: "calc(100vh - 44px - 64px)",
        zIndex: win.zIndex,
      }
    : {
        position: "absolute",
        top: `${win.position.y}px`,
        left: `${win.position.x}px`,
        width: `min(${win.size.width}px, calc(100vw - 20px))`,
        height: `min(${win.size.height}px, calc(100vh - 110px))`,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={windowStyle}
      onClick={() => focusWindow(id)}
      className={`group/win flex flex-col overflow-hidden rounded-2xl border transition-shadow duration-200 select-none ${
        win.isMaximized ? "rounded-none border-x-0" : ""
      } ${
        isFocused
          ? "border-slate-300 bg-white/95 shadow-2xl shadow-slate-900/18 ring-1 ring-[#E95420]/30"
          : "border-slate-300/80 bg-white/90 shadow-xl shadow-slate-900/8 opacity-95"
      }`}
    >
      {/* Linux Window Header Bar */}
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeWindow(id)}
        className={`flex h-11 shrink-0 select-none items-center justify-between border-b px-4 text-xs font-semibold cursor-grab active:cursor-grabbing transition-colors ${
          isFocused
            ? "border-slate-200/90 bg-gradient-to-r from-slate-100 via-white to-slate-100 text-[#181D27]"
            : "border-slate-200/60 bg-slate-100/80 text-slate-500"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-4">
          {icon && (
            <span className={`grid size-6 place-items-center rounded-lg ${
              isFocused ? "bg-orange-50 text-[#E95420]" : "bg-slate-200/80 text-slate-500"
            }`}>
              {icon}
            </span>
          )}
          <span className="truncate text-[13px] font-semibold text-[#181D27]">
            {title}
          </span>
          {subtitle && (
            <span className="hidden truncate text-[11px] font-medium text-slate-400 sm:inline">
              — {subtitle}
            </span>
          )}
        </div>

        {/* Linux-like Circular Window Controls on the Top Right */}
        <div className="flex items-center gap-2 shrink-0 group/controls pl-2">
          {/* Minimize Circle (Linux Amber) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="group/btn relative grid size-3.5 place-items-center rounded-full bg-[#E5A526] text-amber-950/80 transition-all hover:brightness-110 active:scale-95 border border-amber-600/30 shadow-2xs"
            title="Minimize"
            aria-label="Minimize window"
          >
            <Minus className="size-2 opacity-0 group-hover/controls:opacity-100 stroke-[2.5] transition-opacity" />
          </button>

          {/* Maximize / Scale Toggle Circle (Linux Adwaita Green) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="group/btn relative grid size-3.5 place-items-center rounded-full bg-[#26A269] text-emerald-950/80 transition-all hover:brightness-110 active:scale-95 border border-emerald-700/30 shadow-2xs"
            title={win.isMaximized ? "Restore size" : "Maximize window"}
            aria-label={win.isMaximized ? "Restore window size" : "Maximize window size"}
          >
            <Square className="size-2 opacity-0 group-hover/controls:opacity-100 stroke-[2.5] transition-opacity" />
          </button>

          {/* Close Circle (Linux Ubuntu Yaru Coral / Red) */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="group/btn relative grid size-3.5 place-items-center rounded-full bg-[#E95420] text-white transition-all hover:bg-[#C73E10] active:scale-95 border border-rose-700/30 shadow-2xs"
            title="Close"
            aria-label="Close window"
          >
            <X className="size-2 opacity-0 group-hover/controls:opacity-100 stroke-[2.5] transition-opacity" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto bg-[#FAF9F6] p-0 select-text">
        {children}
      </div>

      {/* Manual Scaling / Resize Edge Handles (Active when not maximized) */}
      {!win.isMaximized && (
        <>
          {/* Edge Handles */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "n")}
            className="absolute top-0 left-3 right-3 h-2 cursor-ns-resize hover:bg-[#E95420]/25 transition-colors z-30"
            title="Resize window vertically"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "s")}
            className="absolute bottom-0 left-3 right-3 h-2 cursor-ns-resize hover:bg-[#E95420]/25 transition-colors z-30"
            title="Resize window vertically"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "w")}
            className="absolute top-3 bottom-3 left-0 w-2 cursor-ew-resize hover:bg-[#E95420]/25 transition-colors z-30"
            title="Resize window horizontally"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "e")}
            className="absolute top-3 bottom-3 right-0 w-2 cursor-ew-resize hover:bg-[#E95420]/25 transition-colors z-30"
            title="Resize window horizontally"
          />

          {/* Corner Handles */}
          <div
            onMouseDown={(e) => handleResizeStart(e, "nw")}
            className="absolute top-0 left-0 size-3.5 cursor-nwse-resize z-40"
            title="Scale window diagonally"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "ne")}
            className="absolute top-0 right-0 size-3.5 cursor-nesw-resize z-40"
            title="Scale window diagonally"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "sw")}
            className="absolute bottom-0 left-0 size-3.5 cursor-nesw-resize z-40"
            title="Scale window diagonally"
          />
          <div
            onMouseDown={(e) => handleResizeStart(e, "se")}
            className="absolute bottom-0 right-0 size-5 cursor-nwse-resize z-40 flex items-end justify-end p-1 group/corner"
            title="Scale window diagonally (Drag corner)"
          >
            {/* Visual resize grip indicator on bottom-right corner */}
            <div className="size-2 rounded-br-xs border-r-2 border-b-2 border-slate-400 group-hover/corner:border-[#E95420] transition-colors" />
          </div>
        </>
      )}
    </div>
  );
}
