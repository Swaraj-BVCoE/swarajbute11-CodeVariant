import type { CSSProperties } from "react";

export function Floating3DCanvas() {
  return (
    <div className="desktop-depth-field pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 9 }, (_, index) => (
        <span
          key={index}
          className={"desktop-depth-shape depth-shape-" + ((index % 5) + 1)}
          style={{
            "--shape-x": [8, 20, 35, 49, 63, 76, 89, 29, 69][index] + "%",
            "--shape-y": [15, 72, 31, 84, 18, 61, 38, 52, 90][index] + "%",
            "--shape-delay": -index * 0.7 + "s",
            "--shape-scale": 0.72 + (index % 3) * 0.18,
          } as CSSProperties}
        ><i /></span>
      ))}
    </div>
  );
}
