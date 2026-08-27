import type { SVGProps } from "react";

/**
 * A friendlier, solid airplane glyph with an unmistakable nose — used in place
 * of lucide's thin outline `Plane` wherever the icon needs to clearly read as
 * "pointing somewhere" (progress trackers, flight-path markers). Points
 * straight up at 0deg, so existing `rotate-*` utilities keep aiming it correctly.
 */
export function PlaneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 1.5c.7 0 1.25.56 1.25 1.25v6.62l6.75 4.02v2.1l-6.75-2.15v5.1l2.5 1.85v1.85l-3.75-1.1-3.75 1.1v-1.85l2.5-1.85v-5.1l-6.75 2.15v-2.1l6.75-4.02V2.75c0-.69.56-1.25 1.25-1.25Z" />
    </svg>
  );
}
