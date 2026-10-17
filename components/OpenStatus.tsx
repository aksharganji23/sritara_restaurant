"use client";
import { useEffect, useState } from "react";
import { isOpen, type DayHours } from "@/lib/content/hours";

/** Open/closed badge from the hours set in the admin, checked in India time every minute. */
export function OpenStatus({ week }: { week: DayHours[] }) {
  const [open, setOpen] = useState<boolean | null>(null);
  useEffect(() => {
    const check = () => setOpen(isOpen(week));
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, [week]);
  if (open === null) return null;
  return (
    <p role="status" className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1 text-sm">
      <span aria-hidden="true" className="relative flex size-2.5">
        {open && <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf opacity-75" />}
        <span className={`relative inline-flex size-2.5 rounded-full ${open ? "bg-leaf" : "bg-ember"}`} />
      </span>
      <span className="text-cream">{open ? "Open now" : "Closed now"}</span>
    </p>
  );
}
