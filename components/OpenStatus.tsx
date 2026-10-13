"use client";
import { useEffect, useState } from "react";

/** Shows open/closed based on IST, computed client-side to avoid a stale server value. */
export function OpenStatus() {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => {
      const h = Number(new Intl.DateTimeFormat("en-GB", { hour: "numeric", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()));
      setOpen(h >= 12 && h < 23); // VERIFY hours — keep in sync with lib/site.ts
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);
  if (open === null) return null;
  return (
    <p role="status" className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm">
      <span aria-hidden="true" className={`relative flex size-2.5`}>
        {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-75" />}
        <span className={`relative inline-flex size-2.5 rounded-full ${open ? "bg-leaf" : "bg-ember"}`} />
      </span>
      <span className="text-cream">{open ? "Open now" : "Closed now"}</span>
    </p>
  );
}
