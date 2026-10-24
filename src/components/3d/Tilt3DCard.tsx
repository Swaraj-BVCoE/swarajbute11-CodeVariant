import React, { useRef, useState, type MouseEvent } from "react";

interface Tilt3DCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glowColor?: "emerald" | "amber" | "indigo" | "rose" | "cyan" | "violet";
}

const glowColorClasses = {
  emerald: "from-emerald-500/20 via-teal-500/10 to-transparent",
  amber: "from-amber-500/20 via-orange-500/10 to-transparent",
  indigo: "from-indigo-500/25 via-blue-500/15 to-transparent",
  rose: "from-rose-500/20 via-pink-500/10 to-transparent",
  cyan: "from-cyan-500/25 via-sky-500/15 to-transparent",
  violet: "from-purple-500/25 via-fuchsia-500/15 to-transparent",
};

export function Tilt3DCard({
  children,
  className = "",
  glowColor = "indigo",
  ...props
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -8; // max 8 deg tilt
    const rY = ((x - centerX) / centerX) * 8;

    setRotateX(rX);
    setRotateY(rY);
    setSpotlightPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      style={{ perspective: "1000px" }}
      className="h-full w-full"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: isHovered
            ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(12px)`
            : "rotateX(0deg) rotateY(0deg) translateZ(0px)",
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.5s ease-out",
        }}
        className={`relative h-full w-full transition-shadow duration-300 transform-gpu ${className}`}
        {...props}
      >
        {/* Dynamic Multi-color Spotlight Glow on Cursor */}
        <div
          className={`pointer-events-none absolute inset-0 rounded-[inherit] bg-gradient-radial ${glowColorClasses[glowColor]} opacity-0 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: isHovered
              ? `radial-gradient(circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(99, 102, 241, 0.18), rgba(236, 72, 153, 0.08) 40%, transparent 70%)`
              : undefined,
          }}
        />
        {children}
      </div>
    </div>
  );
}
