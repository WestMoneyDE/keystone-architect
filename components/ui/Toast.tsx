"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Undo2 } from "lucide-react";

/**
 * Minimal undo-toast system — the project's first (per ticket 7's brief,
 * "toast/undo pattern does not exist yet anywhere in the codebase"). Per
 * the plan's "delight" requirement (item 14): "undo-toasts instead of
 * confirm-dialogs" — no modal, no blocking confirm(), just a dismissible
 * toast with an explicit Undo action and a ~5s auto-expiry.
 *
 * Usage: wrap the app once (done in AppShell) with <ToastProvider>, then
 * call `useToast().show({ message, onUndo })` from any client component.
 */

export interface ShowToastOptions {
  message: string;
  /** Called if the user clicks "Undo" before the toast expires. */
  onUndo?: () => void;
  /** ms before auto-dismiss; default 5000 per the plan's "~5 seconds". */
  durationMs?: number;
}

interface ToastItem extends ShowToastOptions {
  id: string;
}

interface ToastContextValue {
  show: (options: ShowToastOptions) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    // Fail soft rather than crashing the page if a component is rendered
    // outside the provider (e.g. in an isolated test) — toasts just no-op.
    return { show: () => {} };
  }
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const show = useCallback(
    (options: ShowToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const duration = options.durationMs ?? 5000;
      setToasts((prev) => [...prev, { ...options, id }]);
      const timer = setTimeout(() => dismiss(id), duration);
      timersRef.current.set(id, timer);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[60] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -16, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -16, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="glass-card pointer-events-auto flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm text-foreground shadow-lg"
            >
              <span>{t.message}</span>
              {t.onUndo && (
                <button
                  type="button"
                  onClick={() => {
                    t.onUndo?.();
                    dismiss(t.id);
                  }}
                  className="flex items-center gap-1 rounded-lg bg-accent/15 px-2 py-1 text-xs font-medium text-accent hover:bg-accent/25"
                >
                  <Undo2 size={12} /> Rückgängig
                </button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
