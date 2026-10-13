"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CircleAlert, CircleCheck, X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------------------------- Sheet -------------------------------- */

interface SheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  //wide content such as an image viewer
  size?: "md" | "lg";
}

//bottom sheet on phones, centred dialog from sm up - mounts nothing while closed
export function Sheet({ open, onClose, title, children, footer, size = "md" }: SheetProps) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    panel.current?.focus();
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[1000] flex animate-np-fade items-end justify-center bg-np-deeper/45 sm:items-center sm:p-6">
      <button type="button" aria-label="Close" className="absolute inset-0 cursor-default" onClick={onClose} />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
        className={cn(
          "relative flex max-h-[88vh] w-full animate-np-sheet flex-col rounded-t-[28px] bg-white outline-none sm:rounded-[28px]",
          size === "lg" ? "sm:max-w-2xl" : "sm:max-w-md",
        )}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-np-border sm:hidden" />
        <div className="flex items-center justify-between gap-3 px-5 pt-3 sm:pt-5">
          <h3 className="text-[17px] font-bold text-np-text">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-full text-np-muted hover:bg-np-surface-muted"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="overflow-y-auto px-5 pb-5 pt-2">{children}</div>
        {footer && <div className="flex gap-3 border-t border-np-border px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

/* ---------------------------------- Toasts ------------------------------- */

interface ToastItem {
  id: number;
  kind: "success" | "error";
  title: string;
  message?: string;
}

interface ToastApi {
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastItem["kind"], title: string, message?: string) => {
    const id = Date.now() + Math.random();
    setItems((list) => [...list.slice(-2), { id, kind, title, message }]);
    setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 4000);
  }, []);

  const [api] = useState<ToastApi>(() => ({
    success: (t, m) => push("success", t, m),
    error: (t, m) => push("error", t, m),
  }));

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 top-3 z-[1100] flex flex-col items-center gap-2 px-4">
        {items.map((t) => (
          <div
            key={t.id}
            className="pointer-events-auto flex w-full max-w-sm animate-np-rise items-start gap-3 rounded-2xl border border-np-border bg-white p-3.5 shadow-[0_10px_30px_rgb(11_61_46/0.15)]"
          >
            {t.kind === "success" ? (
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-np-success" />
            ) : (
              <CircleAlert className="mt-0.5 size-5 shrink-0 text-np-danger" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-np-text">{t.title}</p>
              {t.message && <p className="mt-0.5 text-[13px] text-np-muted">{t.message}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}
