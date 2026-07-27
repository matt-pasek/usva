"use client";

import { useEffect, useRef, useState } from "react";

export function useInViewOnce<T extends HTMLElement>(amount = 0.4) {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || seen) return;

    if (typeof IntersectionObserver === "undefined") {
      setSeen(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setSeen(true);
      },
      { threshold: amount },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [amount, seen]);

  return [ref, seen] as const;
}
