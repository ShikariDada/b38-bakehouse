"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { formatINR } from "@/lib/money";

export type ConfiguratorProps = {
  designSlug: string;
  designName: string;
  leadHours: number;
  rushAllowed: boolean;
  variants: { id: string; label: string; serves: string; pricePaise: number }[];
  flavours: { id: number; name: string; adjustmentPaise: number }[];
  addons: { id: number; name: string; description: string; pricePaise: number }[];
  dates: { date: string; state: "available" | "rush" | "full" | "blocked" }[];
  initialQuote: { totalPaise: number; lines: { label: string; detail?: string; paise: number }[]; deliveryPaise: number };
  zonesHint: string;
};

type Quote = ConfiguratorProps["initialQuote"] & { error?: string };

function istDateLabel(iso: string) {
  return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export function OrderConfigurator(p: ConfiguratorProps) {
  const router = useRouter();
  const [variant, setVariant] = useState(p.variants[1] ?? p.variants[0]);
  const [flavourId, setFlavourId] = useState(p.flavours[0].id);
  const [eggless, setEggless] = useState(false);
  const [message, setMessage] = useState("");
  const [addonIds, setAddonIds] = useState<number[]>([]);
  const [date, setDate] = useState<string>("");
  const [fulfilment, setFulfilment] = useState<"pickup" | "delivery">("pickup");
  const [pincode, setPincode] = useState("");
  const [quote, setQuote] = useState<Quote>(p.initialQuote);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  const selection = useMemo(
    () => ({
      designSlug: p.designSlug,
      variantId: variant.id,
      flavourId,
      eggless,
      message,
      addons: addonIds,
      fulfilment,
      deliveryPincode: fulfilment === "delivery" ? pincode : undefined,
      eventDate: date || "2099-01-01",
    }),
    [p.designSlug, variant, flavourId, eggless, message, addonIds, fulfilment, pincode, date],
  );

  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    debounce.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/quote", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ ...selection, eventDate: date || futureDefault(p.leadHours) }),
        });
        if (res.ok) setQuote(await res.json());
      } catch { /* keep last good quote */ }
    }, 220);
    return () => { if (debounce.current) clearTimeout(debounce.current); };
  }, [selection, date, p.leadHours]);

  const canContinue = !!date && date !== "2099-01-01" && (fulfilment === "pickup" || /^\d{6}$/.test(pincode));

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ selection }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); setBusy(false); return; }
      router.push(`/checkout/${data.code}?t=${data.token}`);
    } catch {
      setError("Network hiccup — try again.");
      setBusy(false);
    }
  }

  return (
    <div className="grid lg:grid-cols-[1fr_380px] gap-10">
      <div className="space-y-9">
        {/* Size */}
        <section aria-labelledby="cfg-size">
          <h2 id="cfg-size" className="eyebrow text-cocoa-600">Size</h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {p.variants.map(v => (
              <button key={v.id} className="chip" aria-pressed={variant.id === v.id} onClick={() => setVariant(v)}>
                <span className="num">{v.label}</span>
                <span className="text-[0.78em] opacity-70 num">{formatINR(v.pricePaise)}</span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-[0.85rem] text-ink-soft num">{variant.serves}</p>
        </section>

        {/* Flavour */}
        <section aria-labelledby="cfg-flavour">
          <h2 id="cfg-flavour" className="eyebrow text-cocoa-600">Flavour</h2>
          <div className="mt-3 flex flex-wrap gap-2.5">
            {p.flavours.map(f => (
              <button key={f.id} className="chip" aria-pressed={flavourId === f.id} onClick={() => setFlavourId(f.id)}>
                {f.name}
                {f.adjustmentPaise > 0 && <span className="text-[0.78em] opacity-70 num">+{formatINR(f.adjustmentPaise)}</span>}
              </button>
            ))}
          </div>
          <button
            className="mt-4 flex items-center gap-3 text-[0.95rem]"
            onClick={() => setEggless(v => !v)}
            role="switch"
            aria-checked={eggless}
          >
            <span
              className="inline-block w-8 h-[18px] rounded-full border transition-colors"
              style={{ background: eggless ? "var(--color-cocoa-700)" : "transparent", borderColor: "var(--color-line-strong)" }}
              aria-hidden
            >
              <span
                className="block w-[14px] h-[14px] bg-cream-50 rounded-full transition-transform"
                style={{ transform: eggless ? "translateX(16px)" : "translateX(2px)", marginTop: 1 }}
              />
            </span>
            Eggless <span className="text-ink-soft text-[0.85rem] num">+{formatINR(5000)}</span>
          </button>
        </section>

        {/* Personalisation */}
        <section aria-labelledby="cfg-personalise">
          <h2 id="cfg-personalise" className="eyebrow text-cocoa-600">Make it theirs</h2>
          <label htmlFor="msg" className="field-label mt-3">Message on the cake <span className="font-normal text-ink-soft">— name, age, a short line. Included.</span></label>
          <input
            id="msg" className="field" maxLength={60} value={message}
            onChange={e => setMessage(e.target.value)}
            placeholder="e.g. Happy 30th Riya"
          />
          <p className="num mt-1 text-[0.78rem] text-ink-soft">{message.length}/60 · longer text? Put it in the customisation link below.</p>
        </section>

        {/* Add-ons */}
        <section aria-labelledby="cfg-addons">
          <h2 id="cfg-addons" className="eyebrow text-cocoa-600">Add-ons</h2>
          <div className="mt-3 space-y-2">
            {p.addons.map(a => {
              const on = addonIds.includes(a.id);
              return (
                <button
                  key={a.id}
                  className="w-full text-left flex items-center justify-between gap-3 border border-line rounded-[3px] px-3.5 py-3 hover:bg-cream-100 transition-colors"
                  style={on ? { borderColor: "var(--color-cocoa-700)", background: "var(--color-cream-100)" } : undefined}
                  onClick={() => setAddonIds(ids => (on ? ids.filter(i => i !== a.id) : [...ids, a.id]))}
                  aria-pressed={on}
                >
                  <span>
                    <span className="text-[0.95rem] font-medium">{a.name}</span>
                    <span className="block text-[0.82rem] text-ink-soft">{a.description}</span>
                  </span>
                  <span className="num text-[0.9rem]">+{formatINR(a.pricePaise)}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Date */}
        <section aria-labelledby="cfg-date">
          <h2 id="cfg-date" className="eyebrow text-cocoa-600">Date</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {p.dates.slice(0, 12).map(d => {
              const disabled = d.state === "full" || d.state === "blocked";
              return (
                <button
                  key={d.date}
                  disabled={disabled}
                  className="chip num"
                  aria-pressed={date === d.date}
                  onClick={() => setDate(d.date)}
                  title={d.state === "rush" ? "Possible short-notice (+15%)" : undefined}
                >
                  {istDateLabel(d.date)}
                  {d.state === "rush" && <span className="text-[0.75em] text-gold-700">rush</span>}
                  {d.state === "full" && <span className="text-[0.75em] line-through opacity-60">full</span>}
                </button>
              );
            })}
          </div>
          <p className="mt-2 text-[0.85rem] text-ink-soft">
            This design needs {p.leadHours >= 72 ? "3 days" : "2 days"} notice. Dates fill on a first-paid basis.
          </p>
        </section>

        {/* Fulfilment */}
        <section aria-labelledby="cfg-fulfil">
          <h2 id="cfg-fulfil" className="eyebrow text-cocoa-600">Pickup or delivery</h2>
          <div className="mt-3 grid grid-cols-2 gap-2.5 max-w-md">
            <button className="chip justify-center" aria-pressed={fulfilment === "pickup"} onClick={() => setFulfilment("pickup")}>
              Pickup — free
            </button>
            <button className="chip justify-center" aria-pressed={fulfilment === "delivery"} onClick={() => setFulfilment("delivery")}>
              Delivery in {p.zonesHint}
            </button>
          </div>
          {fulfilment === "delivery" && (
            <div className="mt-3 max-w-xs">
              <label htmlFor="pin" className="field-label">Pincode</label>
              <input id="pin" inputMode="numeric" pattern="\d{6}" maxLength={6} className="field num" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, ""))} placeholder="281001" />
              <p className="mt-1 text-[0.8rem] text-ink-soft">We currently deliver across Mathura city and Vrindavan.</p>
            </div>
          )}
        </section>

        <section className="border-t border-line pt-6">
          <h2 className="eyebrow text-cocoa-600">Want to change the design itself?</h2>
          <p className="mt-2 text-[0.95rem] text-ink-soft">
            Colours, toppers, themes — anything structural is a quoted change, not a checkbox.
          </p>
          <a href={`/custom/from-design/${p.designSlug}`} className="mt-2 inline-block underline underline-offset-4 text-[0.95rem]">
            Customise this design →
          </a>
        </section>
      </div>

      {/* Summary column (desktop) — mobile users get the fixed bottom bar */}
      <aside className="hidden lg:block">
        <div className="sticky top-[calc(var(--header-h)+1.5rem)] panel p-5">
          <h2 className="display-sm">Your cake</h2>
          <p className="mt-1 text-[0.9rem] text-ink-soft">{p.designName} · {variant.label}</p>
          <dl className="num mt-4 space-y-1.5 text-[0.92rem]">
            {quote.lines.map((l, i) => (
              <div key={i} className="flex justify-between gap-3">
                <dt className="text-ink-soft">{l.label}{l.detail ? <span className="block text-[0.78rem] opacity-70">{l.detail}</span> : null}</dt>
                <dd>{l.paise === 0 ? "included" : formatINR(l.paise)}</dd>
              </div>
            ))}
            {quote.deliveryPaise > 0 && (
              <div className="flex justify-between gap-3"><dt className="text-ink-soft">Delivery</dt><dd>{formatINR(quote.deliveryPaise)}</dd></div>
            )}
          </dl>
          <div className="rule mt-4 pt-3 flex justify-between num font-medium">
            <span>Total</span>
            <span>{formatINR(quote.totalPaise)}</span>
          </div>
          <button className="btn btn-gold w-full mt-4" disabled={!canContinue || busy} onClick={submit}>
            {busy ? "Holding your date…" : date ? `Continue — ${formatINR(quote.totalPaise)}` : "Choose a date"}
          </button>
          <p className="mt-3 text-[0.78rem] text-ink-soft">Price locks when you continue. Pay by UPI — no bargaining, no surprises.</p>
          {error && <p className="mt-2 text-[0.85rem] text-cocoa-700" role="alert">{error}</p>}
        </div>
      </aside>

      {/* Mobile commerce bar */}
      <div className="lg:hidden commerce-bar flex items-center justify-between gap-3">
        <div>
          <p className="num text-[1.05rem] font-medium leading-tight">{formatINR(quote.totalPaise)}</p>
          <p className="text-[0.75rem] text-ink-soft num">{p.designName} · {variant.label}{date ? ` · ${istDateLabel(date)}` : ""}</p>
        </div>
        <button className="btn btn-gold" disabled={!canContinue || busy} onClick={submit}>
          {busy ? "Holding…" : date ? "Continue" : "Choose a date"}
        </button>
      </div>
      {error && <p className="lg:hidden fixed bottom-[76px] left-0 right-0 text-center text-[0.85rem] text-cocoa-700 px-4" role="alert">{error}</p>}
    </div>
  );
}

function futureDefault(leadHours: number) {
  const d = new Date(Date.now() + (leadHours + 24) * 3600000);
  return d.toISOString().slice(0, 10);
}
