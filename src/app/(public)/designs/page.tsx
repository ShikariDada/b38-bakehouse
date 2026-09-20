import Link from "next/link";
import type { Metadata } from "next";
import { listDesigns, variantPrices } from "@/lib/catalog";
import { availabilityFor } from "@/lib/capacity";
import { formatINR } from "@/lib/money";
import { CakeCard } from "@/components/cake-card";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Designs, all real, all orderable",
  description: "Every design here is a cake B38 Bake House has already made by hand. Choose a size, flavour and date. The price is fixed.",
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
  const hasFilters = occasion || style || color || date || sp.q || eggless;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)]">
      <header className="max-w-2xl">
        <p className="eyebrow text-strawberry-deep">The archive</p>
        <h1 className="display display-lg mt-3">Pick your <em>cake</em></h1>
        <p className="mt-4 text-ink-soft text-[1.02rem]">
          {listDesigns().length} designs, all real, all from this oven. Order one as it was, or make it theirs.
        </p>
      </header>

      <form action="/designs" method="get" className="mt-8 flex flex-wrap items-center gap-2.5 bg-cream border border-line rounded-[20px] p-4">
        {occasion && <input type="hidden" name="occasion" value={occasion} />}
        {style && <input type="hidden" name="style" value={style} />}
        {color && <input type="hidden" name="color" value={color} />}
        <label htmlFor="date" className="font-bold text-[0.92rem]">When&rsquo;s the party?</label>
        <input type="date" id="date" name="date" defaultValue={date} className="field num !w-auto !rounded-full" />
        <button className="btn btn-primary !py-2.5 !px-5">Check dates</button>
        {date && (
          <Link href={chipHref(current, "date")} className="chip is-active" aria-pressed="true">
            {new Date(date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} ✕
          </Link>
        )}
        {eggless ? (
          <Link href={chipHref(current, "eggless")} className="chip is-active" aria-pressed="true">Eggless ✕</Link>
        ) : (
          <Link href={chipHref(current, "eggless", "1")} className="chip">Eggless only</Link>
        )}
        <span className="flex-1" />
        <input
          type="search" name="q" defaultValue={sp.q || ""} placeholder="Search: flower, oreo..."
          aria-label="Search designs" className="field !rounded-full sm:!w-60 !py-2.5"
        />
      </form>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <span className="text-[0.8rem] font-bold text-ink-soft self-center shrink-0">Filter:</span>
        {OCCASIONS.map(o => (
          <Link key={o} href={chipHref(current, "occasion", o)} className="chip" aria-pressed={occasion === o}>{o.replace("-", " ")}</Link>
        ))}
        {STYLES.map(st => (
          <Link key={st} href={chipHref(current, "style", st)} className="chip" aria-pressed={style === st}>{st.replace("-", " ")}</Link>
        ))}
        {COLOURS.map(c => (
          <Link key={c} href={chipHref(current, "color", c)} className="chip" aria-pressed={color === c}>{c}</Link>
        ))}
        {hasFilters && <Link href="/designs" className="chip !border-strawberry !text-strawberry-deep font-bold">Clear all ✕</Link>}
      </div>

      {date && (
        <p className="num mt-4 text-[0.88rem] text-ink-soft">
          Showing availability for <strong>{new Date(date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "long" })}</strong>
        </p>
      )}

      {designs.length === 0 ? (
        <div className="mt-10 rounded-[28px] bg-butter-tint border border-butter/40 p-10 text-center">
          <p className="display-sm">Nothing matches those filters yet.</p>
          <p className="mt-2 text-ink-soft">Clear them, or ask us to make it anyway.</p>
          <div className="mt-5 flex justify-center gap-3">
            <Link href="/designs" className="btn btn-ghost">Clear filters</Link>
            <Link href="/custom" className="btn btn-primary">Request it custom</Link>
          </div>
        </div>
      ) : (
        <div className="mt-7 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-9">
          {designs.map((d, i) => (
            <div key={d.slug}>
              <CakeCard design={d} priority={i < 4} delay={(i % 4) * 50} />
              {date && dateStates.has(d.slug) && (
                <p className="mt-1.5 text-[0.78rem] num font-medium">
                  {(() => {
                    const st = dateStates.get(d.slug);
                    if (st === "available") return <span className="text-[#4C6B2F]">● Free on your date</span>;
                    if (st === "rush") return <span className="text-butter">● Short notice +15%</span>;
                    if (st === "full") return <span className="text-strawberry-deep">● Full for this design</span>;
                    return <span className="text-strawberry-deep">● Needs more notice</span>;
                  })()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <section className="mt-20 rounded-[28px] bg-cream border border-line p-8 sm:p-10 grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="display-sm">What the price covers</h2>
          <p className="mt-2 text-ink-soft text-[0.95rem]">
            A hand-piped cake made after you order, boxed with your message on the board. {formatINR(5000)} makes any design eggless.
          </p>
        </div>
        <div>
          <h2 className="display-sm">Sizes</h2>
          <ul className="num mt-2 text-[0.95rem] text-ink-soft space-y-1">
            {variantPrices(125000).map(v => <li key={v.id}>{v.label} · {v.serves}</li>)}
          </ul>
        </div>
        <div>
          <h2 className="display-sm">Not sure which one?</h2>
          <p className="mt-2 text-ink-soft text-[0.95rem]">
            Send us a photo of anything you&rsquo;ve seen. We&rsquo;ll say honestly what we&rsquo;d keep and what it costs.
          </p>
          <Link href="/custom" className="mt-3 inline-block font-bold text-strawberry-deep underline underline-offset-4 decoration-2">Start a brief →</Link>
        </div>
      </section>
    </div>
  );
}
