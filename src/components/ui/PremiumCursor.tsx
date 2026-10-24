import { useEffect, useRef } from "react";

const interactiveSelector = [
  "a",
  "button",
  "input",
  "textarea",
  "select",
  "[role='button']",
  "[data-canvas-card]",
  ".cursor-grab",
].join(",");

export function PremiumCursor() {
  const haloRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const halo = haloRef.current;
    const pointer = pointerRef.current;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!halo || !pointer || !finePointer.matches || reducedMotion.matches) return;

    document.documentElement.dataset.premiumCursor = "true";

    let targetX = -100;
    let targetY = -100;
    let haloX = -100;
    let haloY = -100;
    let frameId = 0;

    const animate = () => {
      haloX += (targetX - haloX) * 0.2;
      haloY += (targetY - haloY) * 0.2;
      halo.style.transform = `translate3d(${haloX}px, ${haloY}px, 0)`;
      frameId = window.requestAnimationFrame(animate);
    };

    const setVisible = (visible: boolean) => {
      const value = String(visible);
      halo.dataset.visible = value;
      pointer.dataset.visible = value;
    };

    const handleMove = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      pointer.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      setVisible(true);
    };

    const handleOver = (event: PointerEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      halo.dataset.interactive = String(Boolean(target?.closest(interactiveSelector)));
    };

    const handleDown = () => { halo.dataset.pressed = "true"; };
    const handleUp = () => { halo.dataset.pressed = "false"; };
    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerover", handleOver, { passive: true });
    window.addEventListener("pointerdown", handleDown, { passive: true });
    window.addEventListener("pointerup", handleUp, { passive: true });
    document.documentElement.addEventListener("mouseleave", handleLeave);
    document.documentElement.addEventListener("mouseenter", handleEnter);
    frameId = window.requestAnimationFrame(animate);

    return () => {
      delete document.documentElement.dataset.premiumCursor;
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerover", handleOver);
      window.removeEventListener("pointerdown", handleDown);
      window.removeEventListener("pointerup", handleUp);
      document.documentElement.removeEventListener("mouseleave", handleLeave);
      document.documentElement.removeEventListener("mouseenter", handleEnter);
    };
  }, []);

  return (
    <>
      <div ref={haloRef} className="premium-cursor" data-visible="false" aria-hidden="true">
        <span />
      </div>
      <div ref={pointerRef} className="premium-cursor-dot" data-visible="false" aria-hidden="true" />
    </>
  );
}
