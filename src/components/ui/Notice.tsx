import { AlertTriangle, CheckCircle2, X } from "lucide-react";
import { cn } from "../../lib/utils";

export function Notice({ type, message, onDismiss }: { type: "success" | "error"; message: string; onDismiss: () => void }) {
  const Icon = type === "success" ? CheckCircle2 : AlertTriangle;
  return (
    <div
      className={cn(
        "fixed right-5 top-5 z-50 flex max-w-[calc(100vw-2.5rem)] items-start gap-3 rounded-xl border p-4 text-sm shadow-lg backdrop-blur-md sm:max-w-md",
        type === "success"
          ? "border-[#C8D6BE] bg-[#FFFFFF] text-[#252724]"
          : "border-rose-200 bg-[#FFF8F8] text-[#9E2A2B]",
      )}
      role={type === "error" ? "alert" : "status"}
      aria-live="polite"
    >
      <Icon
        className={cn(
          "mt-0.5 size-4.5 shrink-0",
          type === "success" ? "text-[#606E54]" : "text-rose-600",
        )}
        aria-hidden="true"
      />
      <span className="flex-1 leading-snug">{message}</span>
      <button
        type="button"
        onClick={onDismiss}
        className="-mr-1.5 -mt-1 grid size-7 shrink-0 place-items-center rounded-lg text-[#858780] hover:bg-[#F3F2EE] hover:text-[#252724]"
        aria-label="Dismiss notification"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
