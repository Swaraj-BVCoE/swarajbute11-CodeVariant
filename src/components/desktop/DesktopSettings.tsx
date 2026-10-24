import { Check, HardDrive } from "lucide-react";
import { useDesktop } from "./DesktopContext";
import { useArchive } from "../../features/archive/ArchiveContext";

export function DesktopSettings() {
  const { wallpaper, setWallpaper } = useDesktop();
  const { projects } = useArchive();

  const wallpapers = [
    {
      id: "aurora-light",
      name: "Aurora Ivory (Default)",
      preview: "from-amber-50 via-slate-50 to-indigo-50",
      description: "Warm ivory with subtle layered gradients & prismatic depth",
    },
    {
      id: "alpine-breeze",
      name: "Alpine Breeze",
      preview: "from-sky-50 via-teal-50 to-emerald-50",
      description: "Mint green and alpine tones inspired by open mountain air",
    },
    {
      id: "electric-sunset",
      name: "Electric Twilight",
      preview: "from-rose-50 via-purple-50 to-indigo-50",
      description: "Vibrant violet and warm coral highlights with soft shadows",
    },
    {
      id: "clean-slate",
      name: "Nordic Minimal",
      preview: "from-slate-100 via-stone-50 to-zinc-100",
      description: "Refined monochrome architectural style with high contrast",
    },
  ];

  return (
    <div className="space-y-6 p-6 text-[#252724]">
      <div>
        <h3 className="font-display text-xl font-medium text-[#252724]">
          Desktop Appearance
        </h3>
        <p className="text-xs text-slate-500">
          Customize your Linux desktop environment, wallpapers, and identity.
        </p>
      </div>

      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Wallpaper Theme
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {wallpapers.map((wp) => {
            const isSelected = wallpaper === wp.id;
            return (
              <button
                key={wp.id}
                type="button"
                onClick={() => setWallpaper(wp.id)}
                className={`relative flex flex-col items-start rounded-2xl border p-4 text-left transition ${
                  isSelected
                    ? "border-indigo-500 bg-white shadow-md ring-2 ring-indigo-500/20"
                    : "border-slate-200 bg-white/70 hover:border-slate-300 hover:bg-white"
                }`}
              >
                <div
                  className={`h-16 w-full rounded-xl bg-gradient-to-tr ${wp.preview} border border-slate-200/60 shadow-xs mb-3`}
                />
                <div className="flex w-full items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">{wp.name}</span>
                  {isSelected && (
                    <span className="grid size-5 place-items-center rounded-full bg-indigo-600 text-white">
                      <Check className="size-3" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 mt-1">{wp.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-4">
        <div className="flex items-center gap-2.5">
          <HardDrive className="size-5 text-indigo-600" />
          <h4 className="text-sm font-semibold text-slate-900">System Specifications</h4>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-slate-400 block">Operating System</span>
            <span className="font-semibold text-slate-800">GraveyardOS Linux 26.10 LTS</span>
          </div>
          <div>
            <span className="text-slate-400 block">Desktop Shell</span>
            <span className="font-semibold text-slate-800">GNOME / KDE Hybrid Plasma</span>
          </div>
          <div>
            <span className="text-slate-400 block">Stored Projects</span>
            <span className="font-semibold text-slate-800">{projects.length} artifacts</span>
          </div>
          <div>
            <span className="text-slate-400 block">Local Vault</span>
            <span className="font-semibold text-emerald-600">Browser local storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
