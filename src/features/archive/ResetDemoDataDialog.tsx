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
    <dialog ref={dialogRef} onClose={onClose} className="m-auto w-[min(92vw,30rem)] rounded-2xl border border-white/10 bg-[#101521] p-0 text-slate-100 shadow-2xl backdrop:bg-black/70 backdrop:backdrop-blur-sm">
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <span className="grid size-11 place-items-center rounded-xl bg-amber-400/10 text-amber-300"><AlertTriangle className="size-5" /></span>
          <button type="button" onClick={onClose} className="grid size-9 place-items-center rounded-lg text-slate-500 hover:bg-white/[0.06] hover:text-white" aria-label="Close reset dialog"><X className="size-4" /></button>
        </div>
        <h2 className="mt-5 font-display text-2xl font-bold text-white">Reset demo archive?</h2>
        <p className="mt-2 text-sm leading-6 text-slate-400">This replaces every local project in this browser with the five original examples. This cannot be undone.</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="secondary" onClick={onClose}>Keep my archive</Button>
          <Button type="button" onClick={() => { onConfirm(); onClose(); }}><RotateCcw className="size-4" /> Reset demo data</Button>
        </div>
      </div>
    </dialog>
  );
}
