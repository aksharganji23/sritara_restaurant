const items = ["Natukodi Bagara", "Mutton Bagara", "Paneer Shahi Korma", "Kamju Pitta", "Garlic Naan", "Veg Manchurian", "Dum Biryani"];

/** Decorative scrolling ribbon. Hidden from screen readers (content repeats the menu). */
export function Marquee() {
  const row = [...items, ...items];
  return (
    <div aria-hidden="true" className="relative overflow-hidden border-y border-line/60 bg-surface py-5">
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
        {row.map((t, i) => (
          <span key={i} className="flex items-center gap-12 font-display text-2xl italic text-muted">
            {t} <span className="text-gold">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
