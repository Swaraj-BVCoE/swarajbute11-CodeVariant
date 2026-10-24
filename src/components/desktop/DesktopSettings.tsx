import { Check, HardDrive } from "lucide-react";
import { useDesktop } from "./DesktopContext";
import { useArchive } from "../../features/archive/ArchiveContext";

export function DesktopSettings() {
  const { wallpaper, setWallpaper } = useDesktop();
  const { projects } = useArchive();

  const wallpapers = [
    {
      id: "aurora-light",
      name: "GNOME Adwaita Frost",
      preview: "from-blue-50 via-slate-50 to-indigo-50",
      description: "Crisp Adwaita slate with deep Linux typography and soft glass contrast",
    },
    {
      id: "alpine-breeze",
      name: "Fedora Blue Wave",
      preview: "from-sky-100 via-blue-50 to-slate-100",
      description: "Signature Fedora oceanic tones tailored for high clarity and focus",
    },
    {
      id: "electric-sunset",
      name: "Ubuntu Yaru Aubergine",
      preview: "from-orange-100 via-purple-50 to-indigo-100",
      description: "Iconic Ubuntu warm orange & aubergine accents with smooth modern gradients",
    },
    {
      id: "clean-slate",
      name: "Pop!_OS Amber Slate",
      preview: "from-amber-50 via-stone-50 to-slate-100",
      description: "System76 Pop!_OS inspired warm titanium and technical amber finish",
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
