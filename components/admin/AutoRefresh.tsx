"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BellRing, RefreshCw } from "lucide-react";

/**
 * Keeps an admin page up to date without reloading:
 *  • re-fetches the page data every `seconds` while the tab is visible,
 *  • re-fetches immediately when you switch back to the tab,
 *  • announces new booking requests and shows the count in the browser tab title.
 */

// Last pending count seen per page. Kept outside the component so it survives
// the component being re-created when fresh data arrives.
const lastSeen = new Map<string, number>();
const unseenNew = new Map<string, number>();

export function AutoRefresh({ pending, seconds = 20 }: { pending?: number; seconds?: number }) {
  const router = useRouter();
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const path = usePathname();
  const [newCount, setNewCount] = useState(() => unseenNew.get(path) ?? 0);

  // Refresh on a timer (only while the tab is visible) and when the tab regains focus.
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = setInterval(refresh, seconds * 1000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [router, seconds]);

  // Every time fresh data arrives from the server, this component re-renders with the new count.
  useEffect(() => {
    setUpdatedAt(new Date());
    if (pending === undefined) return;
    const before = lastSeen.get(path);
    if (before !== undefined && pending > before) {
      const total = (unseenNew.get(path) ?? 0) + (pending - before);
      unseenNew.set(path, total);
      setNewCount(total);
    }
    lastSeen.set(path, pending);
  }, [pending, path]);

  // Show pending requests in the browser tab title, e.g. "(2) Dashboard · Admin".
  useEffect(() => {
    if (pending === undefined) return;
    const base = document.title.replace(/^\(\d+\)\s*/, "");
    document.title = pending > 0 ? `(${pending}) ${base}` : base;
  }, [pending]);

  return (
    <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted">
      <span className="inline-flex items-center gap-1.5">
        <RefreshCw aria-hidden="true" className="size-3.5" />
        Updates automatically
        {updatedAt && (
          <> · last checked {updatedAt.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", second: "2-digit" })}</>
        )}
      </span>
      <div role="status" aria-live="polite">
        {newCount > 0 && (
          <span className="inline-flex items-center gap-2 rounded-full bg-gold px-3 py-1 text-sm font-bold text-gold-deep">
            <BellRing aria-hidden="true" className="size-4" />
            {newCount === 1 ? "New booking request" : `${newCount} new booking requests`}
            <button
              type="button"
              onClick={() => {
                unseenNew.set(path, 0);
                setNewCount(0);
              }}
              className="ml-1 rounded underline underline-offset-2"
              aria-label="Dismiss new booking notice"
            >
              OK
            </button>
          </span>
        )}
      </div>
    </div>
  );
}