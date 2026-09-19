"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./logo";

const NAV = [
  { href: "/designs", label: "Designs" },
  { href: "/custom", label: "Custom Cake" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About" },
];

export function SiteHeader({ whatsapp }: { whatsapp: string }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
          scrolled || open ? "bg-cream-50/95 backdrop-blur-sm border-b border-line" : "bg-transparent border-b border-transparent"
        }`}
        style={{ height: "var(--header-h)" }}
      >
        <div className="mx-auto max-w-6xl h-full px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="B38 Bake House — home">
            <Logo size={36} />
            <span className="display text-[1.28rem] leading-none pt-0.5">B38 <span className="hidden min-[420px]:inline">Bake House</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-7" aria-label="Primary">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`text-[0.95rem] hover:text-cocoa-600 transition-colors ${
                  pathname.startsWith(n.href) ? "text-cocoa-700 underline underline-offset-4 decoration-1" : "text-ink"
                }`}
              >
                {n.label}
              </Link>
            ))}
            <a href={`https://wa.me/${whatsapp}`} className="btn btn-ghost !py-2 !px-3.5 text-[0.9rem]" target="_blank" rel="noopener">
              WhatsApp
            </a>
          </nav>

          <button
            className="md:hidden eyebrow !text-[0.78rem] tracking-[0.1em] px-1 py-2"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 z-40 bg-cocoa-950 text-cream-50 md:hidden">
          <div className="h-full flex flex-col justify-between pt-[calc(var(--header-h)+2.5rem)] px-6 pb-10">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {[...NAV, { href: "/track", label: "Track Order" }, { href: "/faq", label: "FAQ" }].map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="display display-md py-2 border-b border-cocoa-800/60"
                  style={{ transitionDelay: `${i * 30}ms` }}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3">
              <a href={`https://wa.me/${whatsapp}`} className="btn btn-gold w-full">Message on WhatsApp</a>
              <p className="text-cream-50/60 text-sm">Custom cakes, made in Mathura.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
