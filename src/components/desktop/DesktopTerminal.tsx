import React, { useState } from "react";
import { CornerDownLeft } from "lucide-react";
import { useArchive } from "../../features/archive/ArchiveContext";
import { useDesktop } from "./DesktopContext";

export function DesktopTerminal() {
  const { projects, resetDemoData } = useArchive();
  const { openWindow, setWallpaper } = useDesktop();
  const [history, setHistory] = useState<string[]>([
    "Project Graveyard Linux Desktop Shell [Version 26.10-LTS]",
    "Type 'help' to see available commands or 'ls' to inspect preserved projects.",
  ]);
  const [command, setCommand] = useState("");

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = command.trim();
    if (!cmd) return;

    const newHistory = [...history, `$ ${cmd}`];
    const parts = cmd.split(" ");
    const main = parts[0].toLowerCase();

    switch (main) {
      case "help":
        newHistory.push(
          "Available commands:",
          "  ls                List all dormant projects",
          "  stats             Show vault numbers and status distribution",
          "  open <id>         Open a project capsule window",
          "  new               Open project creation window",
          "  wallpaper <name>  Change theme (aurora, alpine, electric, nordic)",
          "  clear             Clear the terminal screen",
          "  reset             Reset the demo data to defaults"
        );
        break;
      case "ls":
        projects.forEach((p) => {
          newHistory.push(`  [${p.id}] ${p.name} - Status: ${p.status} (${p.technologies.join(", ")})`);
        });
        break;
      case "stats": {
        const sleeping = projects.filter((p) => p.status !== "archived").length;
        const revisit = projects.filter((p) => p.revisitLater).length;
        const revived = projects.filter((p) => p.status === "reviving").length;
        newHistory.push(
          `Vault Summary:`,
          `  Total projects: ${projects.length}`,
          `  Sleeping ideas: ${sleeping}`,
          `  Bookmarked to revisit: ${revisit}`,
          `  Revived ideas: ${revived}`
        );
        break;
      }
      case "open": {
        const targetId = parts[1];
        if (!targetId) {
          newHistory.push("Error: Please provide a project ID. E.g.: open project-1");
        } else {
          const match = projects.find((p) => p.id === targetId || p.name.toLowerCase().includes(targetId.toLowerCase()));
          if (match) {
            openWindow("project-details", { projectId: match.id, title: match.name });
            newHistory.push(`Opening Project Capsule: ${match.name}...`);
          } else {
            newHistory.push(`Project "${targetId}" not found in local vault.`);
          }
        }
        break;
      }
      case "new":
        openWindow("add-project");
        newHistory.push("Launched Project Creation wizard.");
        break;
      case "clear":
        setHistory([]);
        setCommand("");
        return;
      case "wallpaper": {
        const wp = parts[1];
        if (wp === "alpine") setWallpaper("alpine-breeze");
        else if (wp === "electric") setWallpaper("electric-sunset");
        else if (wp === "nordic") setWallpaper("clean-slate");
        else setWallpaper("aurora-light");
        newHistory.push(`Wallpaper theme updated to ${wp || "aurora"}.`);
        break;
      }
      case "reset":
        resetDemoData();
        newHistory.push("Demo projects refreshed successfully.");
        break;
      default:
        newHistory.push(`bash: command not found: ${cmd}. Type 'help' for commands.`);
    }

    setHistory(newHistory);
    setCommand("");
  };

  return (
    <div className="flex h-full flex-col bg-[#1E1E2E] p-4 font-mono text-xs text-slate-200">
      <div className="flex-1 overflow-y-auto space-y-1 pr-1">
        {history.map((line, idx) => (
          <div
            key={idx}
            className={
              line.startsWith("$")
                ? "text-indigo-400 font-bold"
                : line.startsWith("Error")
                ? "text-rose-400"
                : line.includes("[Version")
                ? "text-emerald-400 font-semibold"
                : "text-slate-300"
            }
          >
            {line}
          </div>
        ))}
      </div>

      <form onSubmit={handleCommand} className="mt-3 flex items-center gap-2 border-t border-slate-700/60 pt-2">
        <span className="font-bold text-emerald-400">graveyard@linux-desktop:~$</span>
        <input
          type="text"
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Type command..."
          className="flex-1 bg-transparent font-mono text-xs text-slate-100 placeholder-slate-500 focus:outline-hidden"
          autoFocus
        />
        <button type="submit" className="text-slate-400 hover:text-white" aria-label="Execute command">
          <CornerDownLeft className="size-3.5" />
        </button>
      </form>
    </div>
  );
}
