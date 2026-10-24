import { Hand, X } from "lucide-react";
import { useState } from "react";

const GUIDE_KEY = "project-graveyard:canvas-guide-dismissed";

export function CanvasGuide() {
  const [visible, setVisible] = useState(() => {
    try {
      return window.localStorage.getItem(GUIDE_KEY) !== "true";
    } catch {
      return true;
    }
  });

  if (!visible) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(GUIDE_KEY, "true");
    } catch {
      // The guide can still be dismissed for this session when storage is unavailable.
    }
    setVisible(false);
  };

  return (
    <aside className="canvas-guide" aria-label="Canvas interaction instructions">
      <span className="canvas-guide-icon"><Hand className="size-4" /></span>
      <div>
        <strong>Cards are your commands.</strong>
        <p>Drag a card into an action zone to make a change. Keyboard: Space, arrow keys, then Space; Escape cancels.</p>
      </div>
      <button type="button" onClick={dismiss} aria-label="Dismiss canvas instructions">
        <X className="size-4" />
      </button>
    </aside>
  );
}

