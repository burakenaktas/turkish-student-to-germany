/**
 * Wavy dotted flight route drawn behind the step cards.
 * The SVG stretches to the section height; `non-scaling-stroke`
 * keeps the dots perfectly round no matter how far it stretches.
 */
export function FlightPath({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M50 0 C 96 110, 4 210, 50 320 S 96 520, 50 640 S 4 850, 50 1000"
        fill="none"
        stroke="var(--primary)"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray="0.1 12"
        vectorEffect="non-scaling-stroke"
        className="route-drift opacity-60"
      />
    </svg>
  );
}
