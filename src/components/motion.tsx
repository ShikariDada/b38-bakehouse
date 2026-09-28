"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// Reveal system. Anything already at or above the fold reveals immediately
// during the scan (no observer dependency, so client-side navigation can never
// leave visible content stuck invisible). The IntersectionObserver only handles
// below-fold elements as they scroll in. A MutationObserver re-scans when React
// mounts new content after client-side navigation.
export function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.classList.add("js");

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const el = e.target as HTMLElement;
            const delay = Number(el.dataset.delay || 0);
            window.setTimeout(() => el.classList.add("in"), delay);
            io.unobserve(el);
          }
        }
      },
      { rootMargin: "0px 0px 10% 0px", threshold: 0.01 },
    );

    function scan() {
      document.querySelectorAll<HTMLElement>(".rv:not(.in), .rv-img:not(.in)").forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.96) {
          // already on screen: reveal now, with its stagger delay
          const delay = Number(el.dataset.delay || 0);
          window.setTimeout(() => el.classList.add("in"), delay);
        } else {
          io.observe(el);
        }
      });
    }

    scan();

    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
