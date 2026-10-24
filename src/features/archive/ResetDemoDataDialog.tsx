import { AlertTriangle, RotateCcw, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "../../components/ui/Button";

export function ResetDemoDataDialog({ open, onClose, onConfirm }: { open: boolean; onClose: () => void; onConfirm: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-[#E6E4DD] bg-[#FFFFFF] p-0 text-[#252724] shadow-2xl backdrop:bg-black/30 backdrop:backdrop-blur-xs"
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-10 place-items-center rounded-xl bg-[#F8F4EC] text-[#9E7D4E]">
            <AlertTriangle className="size-5" />
          </span>
          <button
            type="button"
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-[#858780] hover:bg-[#F3F2EE] hover:text-[#252724]"
            aria-label="Close reset dialog"
          >
            <X className="size-4" />
          </button>
        </div>
        <h2 className="mt-4 font-display text-2xl font-medium text-[#252724]">Reset demo archive?</h2>
        <p className="mt-2 text-sm leading-relaxed text-[#5C605A]">
          This restores the initial five curated example projects in your local browser storage. Any custom records you have added will be replaced.
        </p>
        <div className="mt-6 flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>
            Keep my archive
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            <RotateCcw className="size-4" /> Reset demo archive
          </Button>
        </div>
      </div>
    </dialog>
  );
}
