// WCAG 2.2 contrast check for the theme tokens in app/globals.css.
// Run: npm run contrast   (exits 1 if any pair fails)
const t = {
  ink: "#0c0a09", surface: "#171412", surface2: "#221d19", line: "#4a4038", field: "#857868",
  cream: "#f5efe6", muted: "#b8ad9f", gold: "#e9b44c", goldDeep: "#1a1208",
  ember: "#ff8a5c", leaf: "#6fcf8a", danger: "#ff8f8f",
};
const lum = (hex) => {
  const [r, g, b] = hex.match(/\w\w/g).map((c) => {
    const v = parseInt(c, 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};
// [foreground, background, minimum, use]
const pairs = [
  ["cream", "ink", 4.5, "body text"], ["cream", "surface", 4.5, "card text"], ["cream", "surface2", 4.5, "input text"],
  ["muted", "ink", 4.5, "secondary text"], ["muted", "surface", 4.5, "secondary on cards"], ["muted", "surface2", 4.5, "hints in inputs"],
  ["gold", "ink", 4.5, "links / accents"], ["gold", "surface", 4.5, "links on cards"],
  ["goldDeep", "gold", 4.5, "button labels"],
  ["ember", "surface", 4.5, "spice icons"], ["leaf", "surface", 3, "veg marker (UI)"],
  ["danger", "surface", 4.5, "error text"], ["field", "surface2", 3, "input borders (WCAG 1.4.11)"], ["field", "surface", 3, "outline buttons on cards"], ["field", "ink", 3, "outline buttons on page"],
  ["line", "ink", 1.5, "card borders (decorative)"], ["gold", "surface2", 3, "focus ring on inputs"],
];
let fail = 0;
for (const [fg, bg, min, use] of pairs) {
  const r = ratio(t[fg], t[bg]);
  const ok = r >= min;
  if (!ok) fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${fg} on ${bg} — ${use}`);
}
process.exit(fail ? 1 : 0);
