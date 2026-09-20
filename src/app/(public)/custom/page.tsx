import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { listDesigns } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Custom cake: start from a design or bring your idea",
  description: "Three honest ways to get something made just for you: personalise an archive design, customise one with quoted changes, or brief a bespoke cake from scratch.",
};

export const dynamic = "force-dynamic";

export default function CustomEntry() {
  const inspiration = listDesigns().slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-20">
      <header className="max-w-2xl rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep">Custom cakes</p>
        <h1 className="display display-lg mt-3">Start where <em>you</em> are</h1>
        <p className="mt-4 text-ink-soft text-[1.02rem]">
          There are three honest ways to do this. Most people only need the first.
        </p>
      </header>

      <div className="mt-10 grid gap-4 md:grid-cols-3">
        <Link
          href="/designs"
          className="rv group block rounded-[24px] bg-cream border border-line p-7 transition-colors hover:border-strawberry/50"
          data-delay="0"
        >
          <p className="num text-strawberry-deep text-[0.9rem] font-bold">No. 1 · most people</p>
          <h2 className="display display-sm mt-2">Personalise a design</h2>
          <p className="mt-3 text-[0.95rem] text-ink-soft leading-relaxed">
            Keep the cake exactly as you see it. Change the name, age, message, flavour, size, eggless. The price updates in front of you, and that&rsquo;s it.
          </p>
          <p className="mt-6 font-bold text-strawberry-deep">
            Pick a design <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </p>
        </Link>

        <Link
          href="/custom/from-design"
          className="rv group block rounded-[24px] bg-butter-tint border border-butter/40 p-7"
          data-delay="100"
        >
          <p className="num text-choc text-[0.9rem] font-bold">No. 2 · meaningful changes</p>
          <h2 className="display display-sm mt-2">Customise a design</h2>
          <p className="mt-3 text-[0.95rem] text-ink/75 leading-relaxed">
            Start from something we&rsquo;ve made and change it properly: different colours, a different theme, different flowers. You&rsquo;ll get a fixed quote after we review it.
          </p>
          <p className="mt-6 font-bold text-choc">
            Pick a starting point <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </p>
        </Link>

        <Link
          href="/custom/from-scratch"
          className="rv group relative block rounded-[24px] bg-choc text-vanilla p-7 overflow-hidden"
          data-delay="200"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-butter/15 -rotate-12 group-hover:rotate-45 transition-transform duration-700" aria-hidden />
          <p className="num relative text-butter text-[0.9rem] font-bold">No. 3 · from a blank page</p>
          <h2 className="display display-sm relative mt-2">Bespoke, from scratch</h2>
          <p className="relative mt-3 text-[0.95rem] text-vanilla/75 leading-relaxed">
            Bring references, a person, an occasion, a plan. We design it, quote a fixed price, and only then do you decide.
          </p>
          <p className="relative mt-6 font-bold text-butter">
            Start a brief <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </p>
        </Link>
      </div>

      <section className="mt-16 border-t border-line pt-8 rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep">Made this way recently</p>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-5 max-w-2xl">
          {inspiration.map(d => (
            <Link key={d.slug} href={`/designs/${d.slug}`} className="cake-card group block">
              <div className="relative overflow-hidden rounded-[20px] bg-vanilla-deep rotate-[-1.5deg] group-hover:rotate-0 transition-transform duration-500" style={{ aspectRatio: "1" }}>
                <Image src={d.images[0].cardSm} alt={`${d.name}, a real cake by B38 Bake House`} fill sizes="30vw" className="cake-img object-cover" />
              </div>
              <p className="cake-title display mt-3 text-[0.95rem]">{d.name}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
