import { useEffect, useRef, useState } from "react";

type Range = { min: number; max: number };

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/** Tweens a {min,max} € range towards `target` whenever it changes. */
export function useAnimatedRange(target: Range, durationMs = 900): Range {
  const [display, setDisplay] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const start = from.current;
    if (start.min === target.min && start.max === target.max) return;

    let raf = 0;
    const startTime = performance.now();

    function tick(now: number) {
      const t = Math.min(1, (now - startTime) / durationMs);
      const eased = easeOutCubic(t);
      setDisplay({
        min: start.min + (target.min - start.min) * eased,
        max: start.max + (target.max - start.max) * eased,
      });
      if (t < 1) raf = requestAnimationFrame(tick);
      else from.current = target;
    }

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.min, target.max, durationMs]);

  return display;
}
