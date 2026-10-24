import { useEffect, useRef } from "react";

export function PremiumCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!cursor || !dot || !canHover || reduceMotion) return;

    let frame = 0;
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;

    const render = () => {
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      frame = window.requestAnimationFrame(render);
    };

    const move = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      dot.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      cursor.dataset.visible = "true";
      dot.dataset.visible = "true";
    };

    const updateInteractiveState = (event: PointerEvent) => {
      const target = event.target as HTMLElement | null;
      cursor.dataset.interactive = target?.closest("a, button, input, textarea, select, [role='button']") ? "true" : "false";
    };

    const hide = () => {
      cursor.dataset.visible = "false";
      dot.dataset.visible = "false";
    };

    frame = window.requestAnimationFrame(render);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerover", updateInteractiveState);
    document.documentElement.addEventListener("mouseleave", hide);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", updateInteractiveState);
      document.documentElement.removeEventListener("mouseleave", hide);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="premium-cursor" aria-hidden="true"><span /></div>
      <div ref={dotRef} className="premium-cursor-dot" aria-hidden="true" />
    </>
  );
}
