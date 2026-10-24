import { AnimatePresence, motion } from "motion/react";
import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { AddProjectPage } from "../pages/AddProjectPage";
import { AllProjectsPage } from "../pages/AllProjectsPage";
import { ArchivedProjectsPage } from "../pages/ArchivedProjectsPage";
import { EditProjectPage } from "../pages/EditProjectPage";
import { NotFoundPage } from "../pages/NotFoundPage";
import { ProjectDetailsPage } from "../pages/ProjectDetailsPage";
import { RevisitLaterPage } from "../pages/RevisitLaterPage";
import { RevivedProjectsPage } from "../pages/RevivedProjectsPage";

export function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.16 }}
      >
        <Routes location={location}>
          <Route element={<AppShell />}>
            <Route index element={<AllProjectsPage />} />
            <Route path="projects/new" element={<AddProjectPage />} />
            <Route path="projects/:projectId" element={<ProjectDetailsPage />} />
            <Route path="projects/:projectId/edit" element={<EditProjectPage />} />
            <Route path="revisit-later" element={<RevisitLaterPage />} />
            <Route path="revived" element={<RevivedProjectsPage />} />
            <Route path="archived" element={<ArchivedProjectsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
