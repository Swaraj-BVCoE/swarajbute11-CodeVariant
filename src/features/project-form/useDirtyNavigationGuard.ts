import { useEffect } from "react";

export function useDirtyNavigationGuard(enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;
    const message = "You have unsaved changes. Leave this page?";
    const beforeUnload = (event: BeforeUnloadEvent) => { event.preventDefault(); event.returnValue = message; };
    const click = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(target instanceof HTMLAnchorElement) || target.target === "_blank" || event.defaultPrevented) return;
      const destination = new URL(target.href, window.location.href);
      if (destination.origin === window.location.origin && destination.pathname !== window.location.pathname && !window.confirm(message)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };
    const currentUrl = window.location.href;
    const popState = () => {
      if (window.confirm(message)) return;
      window.history.pushState(null, "", currentUrl);
    };
    window.addEventListener("beforeunload", beforeUnload);
    window.addEventListener("popstate", popState);
    document.addEventListener("click", click, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      window.removeEventListener("popstate", popState);
      document.removeEventListener("click", click, true);
    };
  }, [enabled]);
}
