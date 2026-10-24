import { useState, useEffect } from "react";
import {
  Wifi,
  Volume2,
  Battery,
  Settings,
  Terminal,
  Check
} from "lucide-react";
import { useDesktop } from "./DesktopContext";
import { useArchive } from "../../features/archive/ArchiveContext";

export function DesktopTopPanel() {
  const {
    activeWorkspace,
    setActiveWorkspace,
    openWindow,
    activeWindowId,
    windows,
    launcherOpen,
    setLauncherOpen
  } = useDesktop();
  const { projects } = useArchive();

  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [controlCenterOpen, setControlCenterOpen] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
      setDate(now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  const currentWindow = activeWindowId ? windows[activeWindowId] : null;

  return (
    <header className="relative z-50 flex h-8 w-full select-none items-center justify-between border-b border-white/60 bg-white/75 px-3 text-[13px] font-medium text-[#252724] shadow-xs backdrop-blur-xl">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setLauncherOpen((prev) => !prev)}
          className={`flex items-center gap-2 rounded-md px-2.5 py-0.5 text-xs font-semibold transition-all ${
            launcherOpen
              ? "bg-indigo-600 text-white shadow-xs"
              : "text-[#252724] hover:bg-slate-200/60"
          }`}
          aria-label="Toggle Project Graveyard Activities launcher"
        >
          <span className="relative flex size-2.5 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-indigo-400 opacity-60"></span>
            <span className="relative inline-flex size-2 rounded-full bg-indigo-600"></span>
          </span>
          <span>Activities</span>
        </button>

        <div className="ml-1 flex items-center rounded-lg bg-slate-100/80 p-0.5 text-[11px] font-bold text-slate-600">
          {[1, 2].map((ws) => (
            <button
              key={ws}
              type="button"
              onClick={() => setActiveWorkspace(ws)}
              className={`rounded-md px-2 py-0.5 transition-all ${
                activeWorkspace === ws
                  ? "bg-white text-indigo-600 shadow-xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              Workspace {ws}
            </button>
          ))}
        </div>

        {currentWindow && currentWindow.isOpen && !currentWindow.isMinimized && (
          <div className="hidden items-center gap-1.5 border-l border-slate-300/60 pl-3 md:flex">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            <span className="max-w-[200px] truncate text-xs font-semibold text-slate-800">
              {currentWindow.title}
            </span>
          </div>
        )}
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <button
          type="button"
          onClick={() => setControlCenterOpen(!controlCenterOpen)}
          className="flex items-center gap-2 rounded-md px-2.5 py-0.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200/60"
        >
          <span>{date}</span>
          <span className="font-bold text-[#252724]">{time}</span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        <div className="hidden items-center gap-1 text-[11px] font-medium text-slate-600 sm:flex">
          <span className="rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-indigo-700">
            {projects.length} artifacts
          </span>
        </div>

        <button
          type="button"
          onClick={() => setControlCenterOpen(!controlCenterOpen)}
          className="flex items-center gap-2 rounded-md bg-slate-100/80 px-2 py-1 text-slate-700 transition hover:bg-slate-200/80"
          aria-label="System status & controls"
        >
          <Wifi className="size-3.5 text-slate-700" />
          <Volume2 className="size-3.5 text-slate-700" />
          <Battery className="size-3.5 text-emerald-600" />
        </button>
      </div>

      {controlCenterOpen && (
        <div className="absolute right-3 top-9 z-50 w-72 rounded-2xl border border-white/70 bg-white/95 p-4 text-[#252724] shadow-2xl backdrop-blur-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Linux Desktop Shell
            </span>
            <span className="rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-bold text-indigo-600">
              v2.4 LTS
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 py-3">
            <button
              type="button"
              onClick={() => {
                openWindow("terminal");
                setControlCenterOpen(false);
              }}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200/60 bg-slate-50/80 p-2.5 text-xs font-medium transition hover:border-indigo-300 hover:bg-white"
            >
              <Terminal className="size-4 text-indigo-600" />
              <span>Shell Terminal</span>
            </button>
            <button
              type="button"
              onClick={() => {
                openWindow("settings");
                setControlCenterOpen(false);
              }}
              className="flex flex-col items-center gap-1.5 rounded-xl border border-slate-200/60 bg-slate-50/80 p-2.5 text-xs font-medium transition hover:border-indigo-300 hover:bg-white"
            >
              <Settings className="size-4 text-purple-600" />
              <span>Appearance</span>
            </button>
          </div>

          <div className="space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
            <div className="flex items-center justify-between">
              <span>Environment:</span>
              <span className="font-semibold text-slate-800">GraveyardOS 26.10</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Vault Status:</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <Check className="size-3.5" /> Stored locally
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
