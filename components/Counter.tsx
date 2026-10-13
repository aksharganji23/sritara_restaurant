"use client";
import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "motion/react";

export function Counter({ to, decimals = 0, suffix = "" }: { to: number; decimals?: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!inView || !ref.current) return;
    if (reduce) { ref.current.textContent = to.toFixed(decimals) + suffix; return; }
    const controls = animate(0, to, {
      duration: 1.6,
      ease: "easeOut",
      onUpdate: (v) => { if (ref.current) ref.current.textContent = v.toFixed(decimals) + suffix; },
    });
    return () => controls.stop();
  }, [inView, to, decimals, suffix, reduce]);

  // Final value is rendered on the server so screen readers / no-JS users see the real number.
  return <span ref={ref}>{to.toFixed(decimals) + suffix}</span>;
}
