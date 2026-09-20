"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

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
    const onScroll = () => setScrolled(window.scrollY > 10);
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
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-vanilla/85 backdrop-blur-md border-b border-line shadow-[0_4px_24px_-16px_rgba(64,37,26,0.25)]"
            : "bg-transparent border-b border-transparent"
        }`}
        style={{ height: "var(--header-h)" }}
      >
        <div className="mx-auto max-w-6xl h-full px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5" aria-label="B38 Bake House, home">
            <Image src="/logo.png" alt="" width={40} height={40} priority className="rounded-full" />
            <span className="display text-[1.35rem] pt-0.5">B38 <span className="hidden min-[420px]:inline font-sans font-900 text-[1.02rem] tracking-tight">Bake House</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Primary">
            {NAV.map(n => (
              <Link
                key={n.href}
                href={n.href}
                className={`relative px-3.5 py-2 text-[0.95rem] font-medium rounded-full transition-colors hover:bg-ink/5 ${
                  pathname.startsWith(n.href) ? "text-strawberry-deep" : "text-ink"
                }`}
              >
                {n.label}
                {pathname.startsWith(n.href) && (
                  <span className="absolute left-1/2 -translate-x-1/2 -bottom-0.5 w-1 h-1 rounded-full bg-strawberry" />
                )}
              </Link>
            ))}
            <a href={`https://wa.me/${whatsapp}`} className="btn btn-primary !py-2.5 !px-5 ml-2 text-[0.92rem]" target="_blank" rel="noopener">
              Order now
            </a>
          </nav>

          <button
            className="md:hidden relative z-50 w-11 h-11 rounded-full border border-ink/15 bg-cream/80 backdrop-blur flex items-center justify-center"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <span className="relative block w-5 h-3">
              <span className="absolute left-0 top-0 w-5 h-[2px] bg-ink rounded transition-all duration-300" style={open ? { top: "5px", transform: "rotate(45deg)" } : undefined} />
              <span className="absolute left-0 bottom-0 w-5 h-[2px] bg-ink rounded transition-all duration-300" style={open ? { bottom: "5px", transform: "rotate(-45deg)" } : undefined} />
            </span>
          </button>
        </div>
      </header>

      {open && (
        <div id="mobile-menu" className="fixed inset-0 z-40 bg-choc text-vanilla md:hidden flex flex-col">
          <div className="h-full flex flex-col justify-between pt-28 px-7 pb-10">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {[...NAV, { href: "/track", label: "Track Order" }, { href: "/faq", label: "FAQ" }].map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="display text-[2.2rem] py-2.5 border-b border-vanilla/10 active:text-butter"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-4">
              <a href={`https://wa.me/${whatsapp}`} className="btn btn-butter w-full !py-4">Order on WhatsApp</a>
              <p className="text-vanilla/50 text-sm">Custom cakes, baked to order in Mathura.</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
