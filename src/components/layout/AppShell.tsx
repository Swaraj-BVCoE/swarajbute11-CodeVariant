import { Outlet } from "react-router-dom";
import { useArchive } from "../../features/archive/ArchiveContext";
import { Notice } from "../ui/Notice";
import { Brand } from "./Brand";
import { MobileNavigation } from "./MobileNavigation";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const { notice, dismissNotice } = useArchive();
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-slate-100">
      <a href="#main-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-violet-400 px-4 py-2 font-semibold text-slate-950 focus:translate-y-0">
        Skip to content
      </a>
      <Sidebar />
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-white/[0.07] bg-[#080b12]/85 px-4 backdrop-blur-xl lg:hidden">
        <Brand />
      </header>
      <main id="main-content" className="min-h-screen pb-28 lg:ml-[17.5rem] lg:pb-0">
        <Outlet />
      </main>
      <MobileNavigation />
      {notice && <Notice type={notice.type} message={notice.message} onDismiss={dismissNotice} />}
    </div>
  );
}
