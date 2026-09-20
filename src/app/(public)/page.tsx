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

const MARQUEE = ["Baked to order", "Real buttercream", "Fresh in Mathura", "Eggless anything", "Fixed prices, no haggling"];

export default function Home() {
  const s = getSettings();
  const designs = listDesigns();
  const hero = designs.find(d => d.slug === "blue-hour-milestone") ?? designs[0];
  const heroFrom = Math.round((hero.baseKgPaise * 0.6) / 5000) * 5000;
  const rail = [
    designs.find(d => d.slug === "groom-stop-ceremony"),
    designs.find(d => d.slug === "midnight-oreo-gold"),
    designs.find(d => d.slug === "vintage-rose-fringe"),
    designs.find(d => d.slug === "blue-hour-milestone"),
    designs.find(d => d.slug === "oreo-overload-drip"),
  ].filter(Boolean);
  const teaser = designs.slice(0, 8);

  return (
    <>
      {/* ————— Hero: big friendly type, cake right beside it ————— */}
      <section className="relative overflow-hidden pt-[calc(var(--header-h)+2.5rem)]">
        <div className="absolute top-[-140px] right-[-120px] w-[420px] h-[420px] rounded-full bg-strawberry-tint blur-3xl opacity-70 pointer-events-none" aria-hidden />
        <div className="mx-auto max-w-6xl px-4 sm:px-6 relative">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] items-center">
            <div className="relative z-10">
              <p className="eyebrow text-strawberry-deep rv" data-delay="0">Custom cakes · baked in {s.city}</p>
              <h1 className="display display-xl mt-4 rv" data-delay="80">
                A cake that
                <br />
                looks like
                <br />
                <em>they get you.</em>
              </h1>
              <p className="mt-6 max-w-md text-[1.06rem] text-ink-soft leading-relaxed rv" data-delay="160">
                Twenty real designs, all made by hand in this kitchen. Pick one, tweak the flavour, the name, the date. Or bring a screenshot of your dream cake and watch it happen.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 rv" data-delay="240">
                <Link href="/designs" className="btn btn-primary">Pick a cake</Link>
                <Link href="/custom" className="btn btn-ghost">Bring my own idea</Link>
              </div>
              <p className="hand mt-5 rv" data-delay="300">freshly baked, never frozen</p>
            </div>

            <div className="relative hero-pop">
              <div className="relative overflow-hidden rounded-[28px] rotate-[1.5deg] shadow-[0_32px_64px_-32px_rgba(64,37,26,0.4)]" style={{ aspectRatio: "4 / 5" }}>
                <Image
                  src={hero.images[0].card}
                  alt="Lavender ombre cake with sugar pearls, made by B38 Bake House"
                  fill priority sizes="(max-width: 1024px) 92vw, 46vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-5 -left-3 sm:-left-8 bg-cream rounded-2xl px-5 py-3.5 shadow-[0_16px_40px_-16px_rgba(64,37,26,0.35)] rotate-[-2deg]">
                <p className="text-[0.72rem] font-bold uppercase tracking-[0.1em] text-strawberry-deep">Design no. {String(hero.number).padStart(2, "0")}</p>
                <p className="display text-[1.15rem] leading-tight">{hero.name}</p>
                <p className="num text-[0.85rem] text-ink-soft">from {formatINR(heroFrom)} · eggless +{formatINR(5000)}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— Marquee ————— */}
      <div className="marquee bg-ink mt-20 py-4 -rotate-[0.6deg] scale-[1.01]" aria-hidden>
        <div className="marquee-track display text-[1.35rem] text-vanilla">
          {Array.from({ length: 2 }).map((_, half) => (
            <span key={half} className="flex gap-14 shrink-0">
              {MARQUEE.map(t => (
                <span key={t} className="flex items-center gap-14">
                  {t} <span className="text-butter">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ————— Fresh out of the oven: snap rail ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-strawberry-deep">Straight from the oven</p>
            <h2 className="display display-md mt-3">Recently made</h2>
          </div>
          <Link href="/designs" className="hidden sm:inline text-[0.93rem] font-bold underline underline-offset-4 decoration-strawberry decoration-2 hover:text-strawberry-deep">
            All {designs.length} designs →
          </Link>
        </div>
        <div className="mt-8 flex gap-4 overflow-x-auto gallery-rail pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {rail.map((d, i) => (
            <Link key={d!.slug} href={`/designs/${d!.slug}`} className="cake-card rv group shrink-0 w-[72%] sm:w-[42%] lg:w-[30%] block" data-delay={String(i * 70)}>
              <div className="relative overflow-hidden rounded-[22px] bg-vanilla-deep" style={{ aspectRatio: "5 / 6" }}>
                <Image src={d!.images[0].card} alt={`${d!.name}, real B38 cake`} fill sizes="(max-width: 640px) 72vw, 30vw" className="cake-img object-cover" />
                <span className="absolute bottom-3 left-3 bg-cream/95 rounded-full px-3 py-1.5 num text-[0.85rem] font-bold">
                  from {formatINR(Math.round((d!.baseKgPaise * 0.6) / 5000) * 5000)}
                </span>
              </div>
              <p className="cake-title display mt-3 text-[1.15rem]">{d!.name}</p>
            </Link>
          ))}
        </div>
        <Link href="/designs" className="sm:hidden mt-2 inline-block text-[0.93rem] font-bold underline underline-offset-4 decoration-strawberry decoration-2">All designs →</Link>
      </section>

      {/* ————— Occasion + date finder ————— */}
      <section className="mt-24 mx-4 sm:mx-6 rounded-[32px] bg-butter-tint border border-butter/40 overflow-hidden">
        <div className="mx-auto max-w-6xl px-6 sm:px-10 py-12 grid gap-10 md:grid-cols-2 items-center">
          <div className="rv">
            <p className="eyebrow text-strawberry-deep">Find your cake</p>
            <h2 className="display display-md mt-3">What are we celebrating?</h2>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {OCCASIONS.map(o => <Link key={o.label} href={o.href} className="chip !bg-cream/80">{o.label}</Link>)}
            </div>
          </div>
          <div className="rv" data-delay="120">
            <h2 className="display display-md">When&rsquo;s the party?</h2>
            <p className="mt-3 text-ink-soft max-w-sm">Pick the date. We only show cakes the oven can still handle that day.</p>
            <form action="/designs" method="get" className="mt-5 flex gap-2 max-w-sm">
              <input type="date" name="date" required aria-label="Date you need the cake" className="field num bg-cream" />
              <button className="btn btn-primary whitespace-nowrap">Check</button>
            </form>
          </div>
        </div>
      </section>

      {/* ————— Two ways to order ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
        <p className="eyebrow text-strawberry-deep">Two ways to order</p>
        <div className="mt-7 grid md:grid-cols-2 gap-4">
          <Link href="/designs" className="rv group relative block p-8 sm:p-10 rounded-[28px] bg-cream border border-line hover:border-strawberry/50 transition-colors overflow-hidden">
            <p className="display-sm">Choose a B38 design</p>
            <p className="mt-3 text-ink-soft max-w-sm text-[0.97rem] leading-relaxed">
              Real cakes from the archive. Fixed price, your flavour, your date. The number you see is the number you pay.
            </p>
            <p className="mt-7 font-bold text-strawberry-deep">Browse {designs.length} designs <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span></p>
            <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-strawberry-tint rotate-12 group-hover:rotate-45 transition-transform duration-700" aria-hidden />
          </Link>
          <Link href="/custom" className="rv group relative block p-8 sm:p-10 rounded-[28px] bg-choc text-vanilla overflow-hidden" data-delay="120">
            <p className="display-sm">Build something custom</p>
            <p className="mt-3 text-vanilla/75 max-w-sm text-[0.97rem] leading-relaxed">
              Send references, a vibe, a plan. You get a fixed quote before you pay a rupee. Wild ideas welcome.
            </p>
            <p className="mt-7 font-bold text-butter">Start a brief <span className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">→</span></p>
            <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-butter/15 -rotate-12 group-hover:rotate-45 transition-transform duration-700" aria-hidden />
          </Link>
        </div>
      </section>

      {/* ————— The archive ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-strawberry-deep">The archive</p>
            <h2 className="display display-md mt-3">Every cake here really happened</h2>
          </div>
          <Link href="/designs" className="hidden sm:inline text-[0.93rem] font-bold underline underline-offset-4 decoration-strawberry decoration-2 hover:text-strawberry-deep">See everything →</Link>
        </div>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
          {teaser.map((d, i) => <CakeCard key={d.slug} design={d} priority={i < 2} delay={(i % 4) * 60} />)}
        </div>
        <Link href="/designs" className="sm:hidden mt-5 inline-block text-[0.93rem] font-bold underline underline-offset-4 decoration-strawberry decoration-2">See all designs →</Link>
      </section>

      {/* ————— Craft macros ————— */}
      <section className="mt-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="eyebrow text-strawberry-deep">How it&rsquo;s made</p>
          <h2 className="display display-md mt-3 max-w-xl">Piped by hand. Ninety minutes of fringe. Worth it.</h2>
        </div>
        <div className="mt-9 flex gap-4 overflow-x-auto gallery-rail px-4 sm:px-6 pb-2">
          {[
            { src: "/media/hero/macro-fringe.webp", cap: "Vintage fringe, one strand at a time" },
            { src: "/media/hero/macro-drip.webp", cap: "Ganache poured at pouring temperature" },
            { src: "/media/hero/macro-petals.webp", cap: "Every petal is its own little decision" },
            { src: "/media/hero/macro-topper.webp", cap: "Edible print, placed while tacky" },
          ].map((m, i) => (
            <figure key={m.src} className="rv-img shrink-0 w-[74%] sm:w-[42%] lg:w-[30%] overflow-hidden rounded-[24px] relative bg-vanilla-deep" data-delay={String(i * 80)} style={{ aspectRatio: "9 / 11" }}>
              <Image src={m.src} alt={m.cap} fill sizes="(max-width: 640px) 74vw, 30vw" className="object-cover" />
              <figcaption className="absolute inset-x-0 bottom-0 p-4 pt-10 bg-gradient-to-t from-ink/70 to-transparent text-cream text-[0.9rem] font-medium">{m.cap}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* ————— The baker ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-28">
        <div className="rv grid md:grid-cols-[0.9fr_1.1fr] gap-10 items-center rounded-[32px] bg-strawberry-tint border border-strawberry/20 p-8 sm:p-12">
          <div className="relative rounded-[24px] overflow-hidden rotate-[-1.5deg]" style={{ aspectRatio: "1" }}>
            <Image src="/media/designs/midnight-oreo-gold/photo-09-card.webp" alt="Midnight Oreo gold cake by Chhaya" fill sizes="(max-width:768px) 90vw, 40vw" className="object-cover" />
          </div>
          <div>
            <p className="eyebrow text-strawberry-deep">The baker</p>
            <h2 className="display display-md mt-3">One oven. One standard.</h2>
            <p className="mt-4 text-[1rem] leading-relaxed text-ink-soft max-w-md">
              B38 is {s.ownerName}&rsquo;s home kitchen. The name is the address: 38-B, Krishna Nagar. Every rosette you see was piped by her, the same day it was ordered, for someone&rsquo;s actual party.
            </p>
            <p className="hand mt-4 text-[1.4rem]">no display case. no day-old shelf.</p>
            <Link href="/about" className="mt-6 inline-block btn btn-ghost !border-ink/25">Meet Chhaya</Link>
          </div>
        </div>
      </section>

      {/* ————— Closing CTA ————— */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 mt-24">
        <div className="rv relative overflow-hidden rounded-[32px] bg-strawberry text-cream px-7 py-14 sm:px-14 sm:py-20 text-center">
          <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-butter/30 blur-2xl" aria-hidden />
          <div className="absolute -bottom-20 -right-10 w-64 h-64 rounded-full bg-cream/15 blur-2xl" aria-hidden />
          <h2 className="display display-lg relative">Tell us who it&rsquo;s for.</h2>
          <p className="mt-4 text-cream/85 max-w-md mx-auto relative text-[1.02rem]">
            A name, a date, a plan. You&rsquo;ll know the price before you pay, and the cake before you cut it.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center relative">
            <Link href="/designs" className="btn btn-cream">Pick a cake</Link>
            <a href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener" className="btn !bg-transparent !border-cream/60 text-cream hover:!bg-cream/10">Ask on WhatsApp</a>
          </div>
        </div>
      </section>
    </>
  );
}
