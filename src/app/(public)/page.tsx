import Image from "next/image";
import Link from "next/link";
import { listDesigns } from "@/lib/catalog";
import { getSettings } from "@/lib/settings";
import { formatINR } from "@/lib/money";
import { CakeCard } from "@/components/cake-card";

export const dynamic = "force-dynamic";

const OCCASIONS = [
  { label: "Birthday", href: "/designs?occasion=birthday" },
  { label: "Anniversary", href: "/designs?occasion=anniversary" },
  { label: "Kids", href: "/designs?occasion=kids" },
  { label: "Milestone", href: "/designs?occasion=milestone" },
  { label: "Festivals", href: "/designs?occasion=festivals" },
];

export default function Home() {
  const s = getSettings();
  const designs = listDesigns();
  const featured = designs.filter(d => d.featured);
  const spotlight = featured.length >= 4 ? featured : designs;
  const teaser = spotlight.slice(0, 6);
  const hero = designs.find(d => d.slug === "lavender-ombre-pearls") ?? designs[0];
  const recently = [designs.find(d => d.slug === "groom-stop-ceremony"), designs.find(d => d.slug === "midnight-oreo-gold"), designs.find(d => d.slug === "vintage-rose-fringe"), designs.find(d => d.slug === "blue-hour-milestone")].filter(Boolean);
  const fromPrice = Math.round((hero.baseKgPaise * 0.6) / 5000) * 5000;

  return (
    <>
      {/* ————— Hero: copy first, real cake immediately under ————— */}
      <section className="relative pt-[calc(var(--header-h)+2.2rem)]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-[46%_54%] md:gap-10 items-end">
            <div className="pb-2">
              <p className="eyebrow text-cocoa-600">Custom cakes · {s.city}</p>
              <h1 className="display display-lg mt-3">
                Bring the reference.
                <br />
                We&rsquo;ll make it <em>yours</em>.
              </h1>
              <p className="mt-5 max-w-md text-ink-soft text-[1.02rem] leading-relaxed">
                B38 is a home kitchen in Krishna Nagar. Every cake on this site is one Chhaya has already made by hand — choose it as-is, personalise the details, or start something new.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/designs" className="btn btn-cocoa">Order a cake</Link>
                <Link href="/custom" className="btn btn-ghost">I have my own idea</Link>
              </div>
              <p className="num mt-4 text-[0.85rem] text-ink-soft">
                Made after you order · {hero.leadHours >= 72 ? "3" : "2"}-day notice on most designs
              </p>
            </div>

            <div className="relative">
              <div className="relative overflow-hidden rounded-[4px]" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src={hero.images[0].card}
                  alt="Lavender ombre cake with sugar pearls — a real B38 Bake House commission"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 54vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="num flex justify-between mt-2 text-[0.8rem] text-ink-soft">
                <span>No. {String(hero.number).padStart(2, "0")} · {hero.name}</span>
                <Link href={`/designs/${hero.slug}`} className="underline underline-offset-2 hover:text-cocoa-700">from {formatINR(fromPrice)}</Link>
              </figcaption>
            </div>
          </div>
        </div>
      </section>

      {/* ————— Recently made ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-cocoa-600">01 · Straight from the oven</p>
              <h2 className="display display-md mt-2">Recently made</h2>
            </div>
            <Link href="/designs" className="hidden sm:inline text-[0.92rem] underline underline-offset-4 decoration-line hover:text-cocoa-700">
              All {designs.length} designs
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {recently.map((d, i) => (
              <Link key={d!.slug} href={`/designs/${d!.slug}`} className="cake-card block">
                <div className="relative overflow-hidden rounded-[4px] bg-cream-200" style={{ aspectRatio: i === 0 ? "4 / 5" : "1 / 1" }}>
                  <Image
                    src={i === 0 ? d!.images[0].card : d!.images[0].cardSm}
                    alt={`${d!.name} — real B38 cake`}
                    fill
                    sizes="(max-width: 768px) 46vw, 24vw"
                    className="object-cover"
                  />
                </div>
                <p className="cake-card-name display mt-2 text-[0.98rem] leading-tight">{d!.name}</p>
              </Link>
            ))}
          </div>
          <Link href="/designs" className="sm:hidden mt-4 inline-block text-[0.92rem] underline underline-offset-4">All designs</Link>
        </section>

      {/* ————— Find your cake: occasions + date ————— */}
      <section className="mt-20 bg-cream-100 border-y border-line">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
            <p className="eyebrow text-cocoa-600">02 · Find your cake</p>
            <div className="mt-2 grid gap-8 md:grid-cols-2 items-start">
              <div>
                <h2 className="display display-md">What are we celebrating?</h2>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {OCCASIONS.map(o => (
                    <Link key={o.label} href={o.href} className="chip">{o.label}</Link>
                  ))}
                </div>
              </div>
              <div className="md:border-l md:border-line md:pl-8">
                <h2 className="display display-md">When do you need it?</h2>
                <p className="mt-3 text-ink-soft max-w-sm">Pick your date and we&rsquo;ll show only the designs that can still be made for it.</p>
                <form action="/designs" method="get" className="mt-4 flex gap-2 max-w-sm">
                  <input type="date" name="date" required aria-label="Date you need the cake" className="field num" />
                  <button className="btn btn-cocoa whitespace-nowrap">Check dates</button>
                </form>
              </div>
            </div>
          </div>
        </section>

      {/* ————— Two ways to start ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-20">
          <p className="eyebrow text-cocoa-600">03 · Two ways to order</p>
          <div className="mt-7 grid md:grid-cols-2 border border-line rounded-[4px] overflow-hidden">
            <Link href="/designs" className="group relative block p-7 sm:p-10 bg-paper hover:bg-cream-100 transition-colors">
              <p className="display-sm">Choose a B38 design</p>
              <p className="mt-3 text-ink-soft max-w-sm text-[0.97rem]">
                Real cakes from the archive. Fixed prices, size and flavour options, and a date you can see is actually free.
              </p>
              <p className="mt-6 text-[0.92rem] underline underline-offset-4 decoration-1 group-hover:text-cocoa-700">Browse {designs.length} designs →</p>
            </Link>
            <Link href="/custom" className="group relative block p-7 sm:p-10 bg-cocoa-950 text-cream-50 hover:bg-cocoa-900 transition-colors">
              <p className="display-sm">Build something custom</p>
              <p className="mt-3 text-cream-50/75 max-w-sm text-[0.97rem]">
                Start from a design and change it, or bring your own references. You&rsquo;ll get a fixed quote before paying anything.
              </p>
              <p className="mt-6 text-[0.92rem] text-gold-300 underline underline-offset-4 decoration-1">Start a custom brief →</p>
            </Link>
          </div>
        </section>

      {/* ————— Designs teaser ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-20">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-cocoa-600">04 · The archive</p>
              <h2 className="display display-md mt-2">Selected designs</h2>
            </div>
            <Link href="/designs" className="hidden sm:inline text-[0.92rem] underline underline-offset-4 decoration-line hover:text-cocoa-700">See everything</Link>
          </div>
          <div className="mt-7 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-5">
            {teaser.map((d, i) => (
              <CakeCard key={d.slug} design={d} priority={i < 2} />
            ))}
          </div>
          <Link href="/designs" className="sm:hidden mt-4 inline-block text-[0.92rem] underline underline-offset-4">See all designs</Link>
        </section>

      {/* ————— Craft: macro strip ————— */}
      <section className="mt-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <p className="eyebrow text-cocoa-600">05 · How it&rsquo;s made</p>
            <h2 className="display display-md mt-2 max-w-xl">Piped by hand, one strand at a time</h2>
          </div>
          <div className="mt-8 flex gap-3 sm:gap-5 overflow-x-auto gallery-rail px-4 sm:px-6 pb-2">
            {[
              { src: "/media/hero/macro-fringe.webp", cap: "Vintage fringe — basketweave tip, ~90 minutes of piping" },
              { src: "/media/hero/macro-drip.webp", cap: "Ganache poured at pouring temperature, never faked with jam" },
              { src: "/media/hero/macro-petals.webp", cap: "Every petal is an individual piping decision" },
              { src: "/media/hero/macro-topper.webp", cap: "Edible-print details placed while the frosting is tacky" },
            ].map(m => (
              <figure key={m.src} className="shrink-0 w-[74%] sm:w-[42%] lg:w-[30%]">
                <div className="relative overflow-hidden rounded-[4px] bg-cream-200" style={{ aspectRatio: "9 / 11" }}>
                  <Image src={m.src} alt={m.cap} fill sizes="(max-width: 640px) 74vw, 30vw" className="object-cover" />
                </div>
                <figcaption className="mt-2 text-[0.83rem] text-ink-soft leading-snug">{m.cap}</figcaption>
              </figure>
            ))}
          </div>
        </section>

      {/* ————— How ordering works ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
          <p className="eyebrow text-cocoa-600">06 · Ordering</p>
          <h2 className="display display-md mt-2">No negotiation. No surprises.</h2>
          <div className="mt-9 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", h: "Pick or brief", p: "Choose an archive design with a fixed price, or send a custom brief with your references." },
              { n: "02", h: "Make it yours", p: "Flavour, eggless, the name and age, your date. The price updates as you choose — you always see the math." },
              { n: "03", h: "Pay the exact amount", p: "Checkout locks your date and takes payment for exactly the total shown. Then it goes straight into the oven queue." },
            ].map(step => (
              <div key={step.n} className="border-t-2 border-cocoa-700 pt-4">
                <p className="num text-gold-700 text-[0.95rem] font-medium">{step.n}</p>
                <h3 className="display-sm mt-1.5">{step.h}</h3>
                <p className="mt-2.5 text-ink-soft text-[0.95rem] leading-relaxed">{step.p}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/how-it-works" className="text-[0.95rem] underline underline-offset-4 decoration-line hover:text-cocoa-700">Lead times, delivery zones & payment details</Link>
          </div>
        </section>

      {/* ————— Closing CTA ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
          <div className="bg-cocoa-950 text-cream-50 rounded-[4px] px-7 py-12 sm:px-12 sm:py-16 relative overflow-hidden">
            <div className="absolute right-0 top-0 h-full w-1/3 hidden md:block relative">
              <Image src={designs.find(d => d.slug === "midnight-oreo-gold")!.images[0].card} alt="" fill sizes="33vw" className="object-cover opacity-90" />
            </div>
            <div className="relative md:max-w-[60%]">
              <h2 className="display display-md">Tell us who it&rsquo;s for.</h2>
              <p className="mt-4 text-cream-50/75 max-w-md text-[1rem]">
                A name, an age, a person, a plan. We&rsquo;ll take it from there — and you&rsquo;ll know the price before you pay.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/designs" className="btn btn-gold">Order a cake</Link>
                <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener" className="btn btn-cream">Ask on WhatsApp</a>
              </div>
            </div>
          </div>
        </section>
    </>
  );
}
