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
    updatePosition
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

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.startX;
      const dy = e.clientY - dragStartRef.current.startY;
      const nextX = Math.max(10, Math.min(window.innerWidth - 300, dragStartRef.current.posX + dx));
      const nextY = Math.max(36, Math.min(window.innerHeight - 150, dragStartRef.current.posY + dy));
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

  if (!win || !win.isOpen || win.isMinimized) {
    return null;
  }

  const windowStyle: React.CSSProperties = win.isMaximized
    ? {
        position: "fixed",
        top: "34px",
        left: "0px",
        width: "100vw",
        height: "calc(100vh - 34px - 64px)",
        zIndex: win.zIndex,
      }
    : {
        position: "absolute",
        top: `${win.position.y}px`,
        left: `${win.position.x}px`,
        width: `min(${win.size.width}px, calc(100vw - 30px))`,
        height: `min(${win.size.height}px, calc(100vh - 120px))`,
        zIndex: win.zIndex,
      };

  return (
    <div
      style={windowStyle}
      onClick={() => focusWindow(id)}
      className={`group/win flex flex-col overflow-hidden rounded-2xl border transition-shadow duration-200 ${
        win.isMaximized ? "rounded-none border-x-0" : ""
      } ${
        isFocused
          ? "border-indigo-400/80 bg-white/95 shadow-2xl shadow-indigo-900/15 ring-1 ring-indigo-400/40"
          : "border-slate-300/70 bg-white/90 shadow-xl shadow-slate-900/5 opacity-95"
      }`}
    >
      <div
        onMouseDown={handleMouseDown}
        onDoubleClick={() => maximizeWindow(id)}
        className={`flex h-11 shrink-0 select-none items-center justify-between border-b px-4 text-xs font-semibold cursor-grab active:cursor-grabbing transition-colors ${
          isFocused
            ? "border-slate-200/90 bg-gradient-to-r from-slate-50 via-white to-slate-50 text-[#252724]"
            : "border-slate-200/50 bg-slate-100/70 text-slate-500"
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 pr-4">
          {icon && (
            <span className={`grid size-6 place-items-center rounded-lg ${
              isFocused ? "bg-indigo-50 text-indigo-600" : "bg-slate-200/80 text-slate-500"
            }`}>
              {icon}
            </span>
          )}
          <span className="truncate text-[13px] font-semibold text-[#252724]">
            {title}
          </span>
          {subtitle && (
            <span className="hidden truncate text-[11px] font-medium text-slate-400 sm:inline">
              — {subtitle}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(id);
            }}
            className="grid size-6 place-items-center rounded-md text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-900"
            title="Minimize"
            aria-label="Minimize window"
          >
            <Minus className="size-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              maximizeWindow(id);
            }}
            className="grid size-6 place-items-center rounded-md text-slate-500 transition hover:bg-slate-200/80 hover:text-slate-900"
            title={win.isMaximized ? "Restore" : "Maximize"}
            aria-label={win.isMaximized ? "Restore window" : "Maximize window"}
          >
            <Square className="size-3" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              closeWindow(id);
            }}
            className="grid size-6 place-items-center rounded-md text-slate-500 transition hover:bg-rose-500 hover:text-white"
            title="Close"
            aria-label="Close window"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="relative flex-1 overflow-y-auto bg-[#FAF9F6] p-0">
        {children}
      </div>
    </div>
  );
}
