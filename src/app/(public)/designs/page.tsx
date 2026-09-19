import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { listDesigns, variantPrices } from "@/lib/catalog";
import { availabilityFor } from "@/lib/capacity";
import { formatINR } from "@/lib/money";
import { CakeCard } from "@/components/cake-card";
import { Reveal } from "@/components/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Designs — real cakes, ready to order",
  description: "Every design here is a cake B38 Bake House has already made by hand. Choose a size, flavour and date — the price is fixed.",
};

const OCCASIONS = ["birthday", "anniversary", "kids", "milestone", "festivals", "just-like-that"];
const STYLES = ["floral", "chocolate", "drip", "rosette", "vintage-piping", "minimal", "loaded", "fruit", "painted"];
const COLOURS = ["pink", "blue", "purple", "white", "chocolate", "gold", "teal", "rainbow"];

function chipHref(current: Record<string, string>, key: string, value?: string) {
  const params = new URLSearchParams(current);
  if (!value || params.get(key) === value) params.delete(key);
  else params.set(key, value);
  const qs = params.toString();
  return `/designs${qs ? `?${qs}` : ""}`;
}

export default async function DesignsPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const occasion = sp.occasion;
  const style = sp.style;
  const color = sp.color;
  const date = sp.date;
  const eggless = sp.eggless === "1";

  let designs = listDesigns({ occasion, style, color });
  if (sp.q) {
    const q = sp.q.toLowerCase();
    designs = designs.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      [...d.styleTags, ...d.occasionTags, ...d.colorTags].some(t => t.includes(q)),
    );
  }

  // Date-aware results: each design gets its availability state for the chosen date
  const dateStates = new Map<string, "available" | "rush" | "full" | "too-soon">();
  if (date) {
    const t = new Date(date + "T12:00:00+05:30").getTime();
    for (const d of designs) {
      const hoursTo = (t - Date.now()) / 3600000;
      if (hoursTo < 24) { dateStates.set(d.slug, "too-soon"); continue; }
      const a = availabilityFor(date, d.capacityPoints);
      if (a.blocked || a.remainingPoints < d.capacityPoints) { dateStates.set(d.slug, "full"); continue; }
      dateStates.set(d.slug, hoursTo < d.leadHours ? (d.rushAllowed ? "rush" : "too-soon") : "available");
    }
    const order = { available: 0, rush: 1, full: 2, "too-soon": 3 };
    designs.sort((a, b) => (order[dateStates.get(a.slug)!] ?? 9) - (order[dateStates.get(b.slug)!] ?? 9));
  }

  const current: Record<string, string> = {};
  for (const [k, v] of Object.entries(sp)) if (v) current[k] = v;
  const hasFilters = Object.keys(current).some(k => !["date", "q"].includes(k)) || !!date || !!sp.q;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)]">
      <header className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <p className="eyebrow text-cocoa-600">The archive</p>
          <h1 className="display display-lg mt-2">Designs</h1>
          <p className="mt-3 max-w-lg text-ink-soft">
            Cakes we&rsquo;ve already made — order one as it was, or personalise the details. Fixed prices, no haggling.
          </p>
        </div>
        <form action="/designs" method="get" className="flex gap-2 w-full sm:w-auto">
          {occasion && <input type="hidden" name="occasion" value={occasion} />}
          <input
            type="search" name="q" defaultValue={sp.q || ""} placeholder='Try "flower" or "chocolate"'
            aria-label="Search designs" className="field sm:w-64"
          />
          <button className="btn btn-ghost">Search</button>
        </form>
      </header>

      {/* When do you need it — the most useful filter */}
      <form action="/designs" method="get" className="mt-7 flex flex-wrap items-center gap-2.5 bg-cream-100 border border-line rounded-[4px] p-3.5">
        {occasion && <input type="hidden" name="occasion" value={occasion} />}
        {style && <input type="hidden" name="style" value={style} />}
        {color && <input type="hidden" name="color" value={color} />}
        <label htmlFor="date" className="text-[0.92rem] font-medium text-cocoa-800">When do you need it?</label>
        <input type="date" id="date" name="date" defaultValue={date} className="field num !w-auto" />
        <button className="btn btn-cocoa !py-2.5">Check</button>
        {date && (
          <Link href={chipHref(current, "date")} className="chip" aria-pressed="true">
            {new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ✕
          </Link>
        )}
        {eggless && <Link href={chipHref(current, "eggless")} className="chip" aria-pressed="true">Eggless ✕</Link>}
        {!eggless && <Link href={chipHref(current, "eggless", "1")} className="chip">Eggless only</Link>}
      </form>

      {/* Filter chips */}
      <div className="mt-5 space-y-2.5">
        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="text-[0.8rem] text-ink-soft self-center shrink-0 w-16">Occasion</span>
          {OCCASIONS.map(o => (
            <Link key={o} href={chipHref(current, "occasion", o)} className="chip" aria-pressed={occasion === o}>
              {o.replace("-", " ")}
            </Link>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="text-[0.8rem] text-ink-soft self-center shrink-0 w-16">Style</span>
          {STYLES.map(st => (
            <Link key={st} href={chipHref(current, "style", st)} className="chip" aria-pressed={style === st}>
              {st.replace("-", " ")}
            </Link>
          ))}
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          <span className="text-[0.8rem] text-ink-soft self-center shrink-0 w-16">Colour</span>
          {COLOURS.map(c => (
            <Link key={c} href={chipHref(current, "color", c)} className="chip" aria-pressed={color === c}>
              {c}
            </Link>
          ))}
          {hasFilters && <Link href="/designs" className="chip">Clear all</Link>}
        </div>
      </div>

      <p className="num mt-6 text-[0.88rem] text-ink-soft">
        {designs.length} {designs.length === 1 ? "design" : "designs"}{occasion && ` · ${occasion}`}{date && ` · for ${new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
      </p>

      {designs.length === 0 ? (
        <div className="mt-10 border border-line rounded-[4px] bg-cream-100 p-10 text-center">
          <p className="display-sm">Nothing in those filters yet.</p>
          <p className="mt-2 text-ink-soft">Clear the filters, or ask us to make it anyway.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/designs" className="btn btn-ghost">Clear filters</Link>
            <Link href="/custom" className="btn btn-cocoa">Request it custom</Link>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5">
          {designs.map((d, i) => (
            <div key={d.slug}>
              <CakeCard design={d} priority={i < 4} />
              {date && dateStates.has(d.slug) && (
                <p className="mt-1 text-[0.78rem] num">
                  {(() => {
                    const st = dateStates.get(d.slug);
                    if (st === "available") return <span className="text-green-800">● Free on your date</span>;
                    if (st === "rush") return <span className="text-gold-700">● Possible short-notice (+15%)</span>;
                    if (st === "full") return <span className="text-cocoa-600">● That date is full for this design</span>;
                    return <span className="text-cocoa-600">● Too soon — needs more notice</span>;
                  })()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Price honesty footnote */}
      <Reveal>
        <section className="mt-16 rule pt-8 grid md:grid-cols-3 gap-8">
          <div>
            <h2 className="display-sm">What the price covers</h2>
            <p className="mt-2 text-ink-soft text-[0.95rem]">
              A hand-piped cake made after you order, packed in a box with your message on the board. {formatINR(5000)} adds eggless to any design.
            </p>
          </div>
          <div>
            <h2 className="display-sm">Sizes</h2>
            <ul className="num mt-2 text-[0.95rem] text-ink-soft space-y-1">
              {variantPrices(125000).map(v => (
                <li key={v.id}>{v.label} · {v.serves}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="display-sm">Not sure?</h2>
            <p className="mt-2 text-ink-soft text-[0.95rem]">
              Send a photo of anything you&rsquo;ve seen — we&rsquo;ll tell you honestly what we&rsquo;d change and what it costs.
            </p>
            <Link href="/custom" className="mt-3 inline-block underline underline-offset-4 text-[0.95rem]">Start a custom brief →</Link>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
