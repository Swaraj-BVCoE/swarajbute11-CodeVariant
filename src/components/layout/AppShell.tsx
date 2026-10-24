import { Outlet } from "react-router-dom";
import { useArchive } from "../../features/archive/ArchiveContext";
import { Notice } from "../ui/Notice";
import { Brand } from "./Brand";
import { MobileNavigation } from "./MobileNavigation";
import { Sidebar } from "./Sidebar";

export function AppShell() {
  const { notice, dismissNotice } = useArchive();
  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[#252724]">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-50 -translate-y-24 rounded-lg bg-[#252724] px-4 py-2 font-medium text-white shadow-lg transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <Sidebar />
      <header className="sticky top-0 z-30 flex h-16 items-center border-b border-[#E6E4DD] bg-white/90 px-5 backdrop-blur-md lg:hidden">
        <Brand />
      </header>
      <main id="main-content" className="relative min-h-screen pb-24 lg:ml-[18.5rem] lg:pb-12">
        <Outlet />
      </main>
      <MobileNavigation />
      {notice && <Notice type={notice.type} message={notice.message} onDismiss={dismissNotice} />}
    </div>
  );
}
