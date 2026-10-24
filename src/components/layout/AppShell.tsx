import { Outlet } from "react-router-dom";
import { useArchive } from "../../features/archive/ArchiveContext";
import { Notice } from "../ui/Notice";
import { Brand } from "./Brand";
import { Floating3DCanvas } from "../3d/Floating3DCanvas";
import { MobileNavigation } from "./MobileNavigation";
import { DesktopWorkspace } from "../desktop/DesktopWorkspace";
import { DesktopProvider } from "../desktop/DesktopContext";
import { PremiumCursor } from "../ui/PremiumCursor";

export function AppShell() {
  const { notice, dismissNotice } = useArchive();

  return (
    <DesktopProvider>
      <div className="relative min-h-screen w-full overflow-hidden bg-[var(--color-canvas)] text-[#252724]">
        <PremiumCursor />
        <a
          href="#main-content"
          className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-[#252724] px-4 py-2 font-medium text-white shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>

        {/* Desktop Browser View: Rich Interactive Linux Desktop Environment */}
        <div className="hidden md:block h-screen w-screen overflow-hidden">
          <DesktopWorkspace />
        </div>

        {/* Mobile / Tablet View: Touch-friendly adapted layout preserving Linux aesthetics */}
        <div className="block md:hidden min-h-screen">
          <Floating3DCanvas />
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/60 bg-white/85 px-4 backdrop-blur-xl">
            <Brand />
            <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[11px] font-bold text-indigo-600">
              Linux OS Mobile
            </span>
          </header>
          <main id="main-content" className="relative z-10 min-h-screen pb-28">
            <Outlet />
          </main>
          <MobileNavigation />
          {notice && <Notice type={notice.type} message={notice.message} onDismiss={dismissNotice} />}
        </div>
      </div>
    </DesktopProvider>
  );
}
