import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { listDesigns } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Custom cake — start from a design or bring your idea",
  description: "Three honest ways to get something made just for you: personalise an archive design, customise one with quoted changes, or brief a bespoke cake from scratch.",
};

export const dynamic = "force-dynamic";

export default function CustomEntry() {
  const inspiration = listDesigns().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)]">
      <header className="max-w-2xl">
        <p className="eyebrow text-cocoa-600">Custom cakes</p>
        <h1 className="display display-lg mt-2">Start where <em>you</em> are</h1>
        <p className="mt-4 text-ink-soft text-[1.02rem]">
          There are three honest ways to do this. Most people only need the first.
        </p>
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link href="/designs" className="group block border border-line rounded-[4px] p-7 bg-paper hover:bg-cream-100 transition-colors">
          <p className="num text-cocoa-600 text-[0.9rem]">1 — most people</p>
          <h2 className="display-sm mt-1.5">Personalise a design</h2>
          <p className="mt-3 text-[0.95rem] text-ink-soft">
            Keep the cake exactly as you see it. Change the name, age, message, flavour, size, eggless. The price updates in front of you — that&rsquo;s it.
          </p>
          <p className="mt-5 text-[0.9rem] underline underline-offset-4 decoration-1 group-hover:text-cocoa-700">Pick a design →</p>
        </Link>

        <Link href="/custom/from-design" className="group block border border-line rounded-[4px] p-7 bg-cream-100 hover:bg-cream-200 transition-colors">
          <p className="num text-cocoa-600 text-[0.9rem]">2 — meaningful changes</p>
          <h2 className="display-sm mt-1.5">Customise a design</h2>
          <p className="mt-3 text-[0.95rem] text-ink-soft">
            Start from something we&rsquo;ve made and change it properly — different colours, a different theme, different flowers. You&rsquo;ll get a fixed quote after we review it.
          </p>
          <p className="mt-5 text-[0.9rem] underline underline-offset-4 decoration-1 group-hover:text-cocoa-700">Pick a starting point →</p>
        </Link>

        <Link href="/custom/from-scratch" className="group block border border-cocoa-800 rounded-[4px] p-7 bg-cocoa-950 text-cream-50 hover:bg-cocoa-900 transition-colors">
          <p className="num text-gold-500 text-[0.9rem]">3 — from a blank page</p>
          <h2 className="display-sm mt-1.5">Bespoke, from scratch</h2>
          <p className="mt-3 text-[0.95rem] text-cream-50/75">
            Bring references, a person, an occasion, a plan. We design it, quote a fixed price, and only then do you decide.
          </p>
          <p className="mt-5 text-[0.9rem] text-gold-300 underline underline-offset-4 decoration-1">Start a brief →</p>
        </Link>
      </div>

      <section className="mt-16 rule pt-8">
        <p className="eyebrow text-cocoa-600">Made this way recently</p>
        <div className="mt-5 grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl">
          {inspiration.map(d => (
            <Link key={d.slug} href={`/designs/${d.slug}`} className="cake-card block">
              <div className="relative overflow-hidden rounded-[4px] bg-cream-200" style={{ aspectRatio: "1" }}>
                <Image src={d.images[0].cardSm} alt={d.name} fill sizes="30vw" className="object-cover" />
              </div>
              <p className="cake-card-name display mt-2 text-[0.95rem]">{d.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
