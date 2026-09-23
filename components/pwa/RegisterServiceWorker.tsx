"use client";

import { useEffect } from "react";

interface RegisterServiceWorkerProps {
  pwaEnabled: boolean;
}

/**
 * Registers public/sw.js when FeatureFlags.pwaEnabled is true (default
 * true per the schema) and unregisters/no-ops otherwise, so flipping the
 * Settings toggle off actually stops offline caching rather than just
 * hiding a switch. See public/sw.js for the exact caching scope
 * (article-reading pages only — not a full offline app).
 */
export function RegisterServiceWorker({ pwaEnabled }: RegisterServiceWorkerProps) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if (!pwaEnabled) {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        for (const reg of regs) {
          if (reg.active?.scriptURL.endsWith("/sw.js")) reg.unregister();
        }
      });
      return;
    }

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      // Non-fatal: offline caching just won't be available this session.
      console.warn("Keystone: service worker registration failed", err);
    });
  }, [pwaEnabled]);

  return null;
}
