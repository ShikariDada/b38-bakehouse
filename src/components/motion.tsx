"use client";

import { useEffect } from "react";

// Adds the `js` gate class + a single IntersectionObserver that reveals
// .rv / .rv-img elements once, with per-element stagger via data-delay.
export function Motion() {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const els = Array.from(document.querySelectorAll<HTMLElement>(".rv, .rv-img"));
    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.delay || 0);
            setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0.08 },
    );
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
