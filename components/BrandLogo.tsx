import { Logo } from "./Logo";

/**
 * Signboard-style logo: star-and-laurel emblem + neon wordmark.
 * The LAST word of the name becomes the red "CLASSIC" line; the rest is the
 * white neon line, with a red drop over the first "i" like the signboard.
 */
function WithDrop({ text }: { text: string }) {
  const i = text.indexOf("i");
  if (i < 0) return <>{text}</>;
  return (
    <>
      {text.slice(0, i)}
      <span className="brand-i">ı</span>
      {text.slice(i + 1)}
    </>
  );
}

type Size = "sm" | "md" | "lg";
const sizes: Record<Size, { emblem: string; main: string; accent: string; gap: string }> = {
  sm: { emblem: "size-10", main: "text-lg", accent: "text-[0.74rem]", gap: "gap-2" },
  md: { emblem: "size-14", main: "text-2xl", accent: "text-[0.98rem]", gap: "gap-2.5" },
  lg: { emblem: "size-20", main: "text-4xl sm:text-5xl", accent: "text-lg sm:text-xl", gap: "gap-4" },
};

export function BrandLogo({ name, size = "md", className = "" }: { name: string; size?: Size; className?: string }) {
  const words = name.trim().split(/\s+/);
  const accent = words.length > 1 ? words.pop()! : "";
  const main = words.join(" ");
  const s = sizes[size];
  return (
    <span className={`inline-flex items-center ${s.gap} ${className}`}>
      <Logo className={`${s.emblem} shrink-0`} />
      <span className="flex flex-col items-center leading-none">
        <span className={`brand-main ${s.main}`}>
          <WithDrop text={main} />
        </span>
        {accent && <span className={`brand-accent ${s.accent}`}>{accent}</span>}
      </span>
    </span>
  );
}