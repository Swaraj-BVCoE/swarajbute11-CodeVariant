import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Notice({ type, message, onDismiss }: { type: "success" | "error"; message: string; onDismiss: () => void }) {
  const Icon = type === "success" ? CheckCircle2 : AlertTriangle;
  return (
    <div
      className={cn(
        "fixed right-4 top-4 z-50 flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border px-4 py-3 text-sm shadow-2xl backdrop-blur-xl sm:max-w-md",
        type === "success" ? "border-emerald-300/20 bg-emerald-950/90 text-emerald-100" : "border-rose-300/20 bg-rose-950/90 text-rose-100",
      )}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span className="leading-5">{message}</span>
      <button type="button" onClick={onDismiss} className="-mr-1 grid size-6 shrink-0 place-items-center rounded-md hover:bg-white/10" aria-label="Dismiss notification">
        <X className="size-3.5" />
      </button>
    </div>
  );
}
