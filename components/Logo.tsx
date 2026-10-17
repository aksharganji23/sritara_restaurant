/**
 * Emblem from the restaurant's signboard: a white star inside a glowing
 * orange-red laurel wreath. Pure SVG, so it stays sharp at any size.
 */

// [x, y, rotation, rx, ry] for each laurel leaf (precomputed so server and browser match exactly).
const LEAVES: [number, number, number, number, number][] = [
  [24.4, 54.4, -44.0, 2.3, 5.2],
  [26.01, 49.45, -102.0, 1.79, 4.06],
  [17.62, 50.8, -26.0, 2.18, 4.94],
  [20.52, 46.8, -84.0, 1.7, 3.85],
  [12.31, 45.31, -8.0, 2.07, 4.68],
  [16.09, 42.56, -66.0, 1.61, 3.65],
  [8.97, 38.48, 10.0, 1.95, 4.42],
  [13.18, 37.12, -48.0, 1.52, 3.45],
  [7.92, 31.0, 28.0, 1.84, 4.16],
  [12.08, 31.0, -30.0, 1.44, 3.24],
  [9.22, 23.6, 46.0, 1.72, 3.9],
  [12.93, 24.8, -12.0, 1.35, 3.04],
  [12.73, 17.0, 64.0, 1.61, 3.64],
  [15.67, 19.14, 6.0, 1.26, 2.84],
  [39.6, 54.4, 404.0, 2.3, 5.2],
  [37.99, 49.45, 462.0, 1.79, 4.06],
  [46.38, 50.8, 386.0, 2.18, 4.94],
  [43.48, 46.8, 444.0, 1.7, 3.85],
  [51.69, 45.31, 368.0, 2.07, 4.68],
  [47.91, 42.56, 426.0, 1.61, 3.65],
  [55.03, 38.48, 350.0, 1.95, 4.42],
  [50.82, 37.12, 408.0, 1.52, 3.45],
  [56.08, 31.0, 332.0, 1.84, 4.16],
  [51.92, 31.0, 390.0, 1.44, 3.24],
  [54.78, 23.6, 314.0, 1.72, 3.9],
  [51.07, 24.8, 372.0, 1.35, 3.04],
  [51.27, 17.0, 296.0, 1.61, 3.64],
  [48.33, 19.14, 354.0, 1.26, 2.84],
];

const STEMS = ["M26.68 52.35 L25.20 51.92 L23.76 51.40 L22.36 50.77 L21.00 50.05 L19.70 49.24 L18.46 48.34 L17.28 47.35 L16.17 46.28 L15.15 45.14 L14.20 43.93 L13.34 42.66 L12.58 41.33 L11.90 39.95 L11.33 38.52 L10.85 37.06 L10.48 35.57 L10.21 34.06 L10.05 32.53 L10.00 31.00 L10.05 29.47 L10.21 27.94 L10.48 26.43 L10.85 24.94 L11.33 23.48 L11.90 22.05 L12.58 20.67 L13.34 19.34 L14.20 18.07 L15.15 16.86", "M37.32 52.35 L38.80 51.92 L40.24 51.40 L41.64 50.77 L43.00 50.05 L44.30 49.24 L45.54 48.34 L46.72 47.35 L47.83 46.28 L48.85 45.14 L49.80 43.93 L50.66 42.66 L51.42 41.33 L52.10 39.95 L52.67 38.52 L53.15 37.06 L53.52 35.57 L53.79 34.06 L53.95 32.53 L54.00 31.00 L53.95 29.47 L53.79 27.94 L53.52 26.43 L53.15 24.94 L52.67 23.48 L52.10 22.05 L51.42 20.67 L50.66 19.34 L49.80 18.07 L48.85 16.86"];

export function Logo({ className = "", glow = true }: { className?: string; glow?: boolean }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" focusable="false" className={className}>
      <defs>
        <linearGradient id="logo-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb067" />
          <stop offset="1" stopColor="#e2461d" />
        </linearGradient>
        <filter id="logo-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter={glow ? "url(#logo-glow)" : undefined}>
        {STEMS.map((d, i) => (
          <path key={i} d={d} fill="none" stroke="#c2410c" strokeWidth="1.4" strokeLinecap="round" />
        ))}
        {LEAVES.map(([x, y, r, rx, ry], i) => (
          <ellipse
            key={i}
            cx={x}
            cy={y}
            rx={rx}
            ry={ry}
            transform={`rotate(${r} ${x} ${y})`}
            fill="url(#logo-leaf)"
            stroke="#ffb27a"
            strokeOpacity=".7"
            strokeWidth=".4"
          />
        ))}
        <path
          d="M32 14.5l4.4 10.9 11.7.8-9 7.4 2.9 11.4L32 38.7l-10 6.3 2.9-11.4-9-7.4 11.7-.8z"
          fill="#fffaf2"
          stroke="#fff"
          strokeWidth=".8"
          strokeLinejoin="round"
        />
      </g>
    </svg>
  );
}