import { Outlet } from "react-router-dom";
import { useArchive } from "../../features/archive/ArchiveContext";
import { Notice } from "../ui/Notice";
import { PremiumCursor } from "../ui/PremiumCursor";
import { Brand } from "./Brand";
import { MobileNavigation } from "./MobileNavigation";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const { notice, dismissNotice } = useArchive();
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-slate-100">
      <PremiumCursor />
      <div className="ambient-stage" aria-hidden="true">
        <span className="ambient-orb ambient-orb-one" />
        <span className="ambient-orb ambient-orb-two" />
        <span className="ambient-orb ambient-orb-three" />
      </div>
      <a href="#main-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-xl bg-[#ffd21c] px-4 py-2 font-semibold text-[#17130c] shadow-lg focus:translate-y-0">
        Skip to content
      </a>
      <Sidebar />
      <header className="sticky top-0 z-30 flex h-[4.5rem] items-center border-b border-white/10 bg-[#0c0b08]/75 px-4 backdrop-blur-2xl lg:hidden">
        <Brand />
      </header>
      <main id="main-content" className="relative min-h-screen pb-28 lg:ml-[18.5rem] lg:pb-0">
        <Outlet />
      </main>
      <MobileNavigation />
      {notice && <Notice type={notice.type} message={notice.message} onDismiss={dismissNotice} />}
    </div>
  );
}
