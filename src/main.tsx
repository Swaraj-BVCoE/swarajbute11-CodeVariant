import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { App } from "./app/App";
import { ArchiveProvider } from "./features/archive/ArchiveContext";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <ArchiveProvider>
        <App />
      </ArchiveProvider>
    </BrowserRouter>
  </StrictMode>,
);
