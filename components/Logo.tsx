export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" focusable="false" className={className}>
      <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M20 6l3.4 9.2 9.8.4-7.7 6.1 2.7 9.4L20 25.6l-8.2 5.5 2.7-9.4-7.7-6.1 9.8-.4z"
        fill="currentColor"
      />
    </svg>
  );
}
