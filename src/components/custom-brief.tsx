"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type BriefProps = {
  startDesign?: { slug: string; name: string; number: number; image: string; fromPrice: string };
  styleGallery: { tag: string; label: string; image: string }[];
  flavours: string[];
  city: string;
};

type Ref = { name: string; dataUrl: string; note: string };

const BUDGETS = [
  { id: "b1", label: "₹700 – ₹1,200", note: "simple single-tier" },
  { id: "b2", label: "₹1,200 – ₹1,800", note: "most custom cakes land here" },
  { id: "b3", label: "₹1,800 – ₹2,800", note: "loaded or intricate piping" },
  { id: "b4", label: "₹2,800+", note: "tiered, sculpted, edible print work" },
];

const STEP_TITLES = ["The occasion", "Your references", "What matters", "Size & taste", "The look", "The words", "Budget", "Pickup or delivery", "Review"];

export function CustomBrief(p: BriefProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    occasion: "",
    person: "",
    eventDate: "",
    refs: [] as Ref[],
    mustKeep: "",
    avoid: "",
    servings: "10–12 (1 kg)",
    flavour: p.flavours[0],
    eggless: false,
    allergies: "",
    styles: [] as string[],
    colorNotes: "",
    name: "",
    age: "",
    message: "",
    budget: "",
    fulfilment: "pickup" as "pickup" | "delivery",
    address: "",
    phone: "",
    contactName: "",
    notes: "",
  });

  // Persist through refresh/navigation — the spec treats losing a half-written brief as a bug.
  const key = `b38-brief-${p.startDesign?.slug ?? "scratch"}`;
  useEffect(() => {
    const raw = localStorage.getItem(key);
    if (raw) { try { setForm({ ...form, ...JSON.parse(raw) }); setSaved(true); } catch {} }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const { refs, ...rest } = form;
    localStorage.setItem(key, JSON.stringify(rest));
  }, [form, key]);

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) => setForm(f => ({ ...f, [k]: v }));

  const valid = useMemo(() => {
    switch (step) {
      case 0: return !!form.occasion && !!form.eventDate;
      case 2: return form.mustKeep.trim().length > 0 || form.styles.length > 0;
      case 7: return form.fulfilment === "pickup" || form.address.trim().length > 5;
      case 8: return form.contactName.trim().length >= 2 && /^\d{10}$/.test(form.phone.replace(/\D/g, ""));
      default: return true;
    }
  }, [step, form]);

  async function addFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files).slice(0, 5 - form.refs.length)) {
      if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) continue;
      const dataUrl = await new Promise<string>(res => {
        const r = new FileReader();
        r.onload = () => res(String(r.result));
        r.readAsDataURL(file);
      });
      setForm(f => ({ ...f, refs: [...f.refs, { name: file.name, dataUrl, note: "" }] }));
    }
  }

  async function submit() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/custom-requests", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...form,
          startDesign: p.startDesign?.slug ?? null,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Couldn't send the brief."); setBusy(false); return; }
      localStorage.removeItem(key);
      router.push(`/request/${data.token}?new=1`);
    } catch {
      setError("Network hiccup — your brief is saved on this device, try again.");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-32">
      {/* progress line */}
      <div className="flex items-center gap-2" aria-hidden>
        {STEP_TITLES.map((_, i) => (
          <span key={i} className="h-[3px] flex-1 rounded-full" style={{ background: i <= step ? "var(--color-cocoa-700)" : "var(--color-line)" }} />
        ))}
      </div>
      <p className="num mt-2 text-[0.78rem] text-ink-soft">Step {step + 1} of {STEP_TITLES.length} — {STEP_TITLES[step]}</p>
      {saved && step === 0 && <p className="mt-1 text-[0.8rem] text-cocoa-600">Welcome back — we kept your answers.</p>}

      {p.startDesign && (
        <div className="mt-5 flex items-center gap-3 border border-line rounded-[4px] p-3 bg-paper">
          <div className="relative w-14 h-14 rounded-[3px] overflow-hidden bg-cream-200 shrink-0">
            <Image src={p.startDesign.image} alt="" fill sizes="56px" className="object-cover" />
          </div>
          <div>
            <p className="text-[0.82rem] text-ink-soft num">Starting from No. {String(p.startDesign.number).padStart(2, "0")}</p>
            <p className="display text-[1.05rem] leading-tight">{p.startDesign.name}</p>
            <p className="num text-[0.8rem] text-ink-soft">{p.startDesign.fromPrice} · changes quoted after review</p>
          </div>
        </div>
      )}

      <div className="mt-8 min-h-[300px]">
        {step === 0 && (
          <section>
            <h1 className="display display-md">Who is it for?</h1>
            <div className="mt-5 grid gap-4">
              <div>
                <label className="field-label" htmlFor="occ">Occasion</label>
                <div className="flex flex-wrap gap-2">
                  {["Birthday", "Anniversary", "Kids' birthday", "Milestone", "Farewell", "Festival", "Just like that"].map(o => (
                    <button key={o} className="chip" aria-pressed={form.occasion === o} onClick={() => set("occasion", o)}>{o}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="person">The person / the plan</label>
                <input id="person" className="field" value={form.person} onChange={e => set("person", e.target.value)} placeholder="e.g. my father, turning 60, loves gardening" />
              </div>
              <div>
                <label className="field-label" htmlFor="ed">Date you need it</label>
                <input id="ed" type="date" className="field num" value={form.eventDate} min={new Date(Date.now() + 5 * 86400000).toISOString().slice(0, 10)} onChange={e => set("eventDate", e.target.value)} />
                <p className="mt-1 text-[0.8rem] text-ink-soft">Custom work needs at least 4–5 days.</p>
              </div>
            </div>
          </section>
        )}

        {step === 1 && (
          <section>
            <h1 className="display display-md">Show us what you like</h1>
            <p className="mt-2 text-ink-soft text-[0.95rem]">Up to 5 photos. Screenshots, Pinterest saves, last year&rsquo;s cake — anything helps.</p>
            <label className="mt-5 block border-2 border-dashed border-line-strong rounded-[4px] p-8 text-center cursor-pointer hover:bg-cream-100 transition-colors">
              <input type="file" accept="image/*" multiple className="sr-only" onChange={e => addFiles(e.target.files)} />
              <span className="text-[0.95rem] font-medium">Tap to add photos</span>
              <span className="block mt-1 text-[0.8rem] text-ink-soft">or drop them here · JPG/PNG, up to 8 MB each</span>
            </label>
            {form.refs.length > 0 && (
              <ul className="mt-4 grid grid-cols-3 gap-3">
                {form.refs.map((r, i) => (
                  <li key={i} className="relative">
                    <div className="relative rounded-[4px] overflow-hidden bg-cream-200" style={{ aspectRatio: "1" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={r.dataUrl} alt={`Reference ${i + 1}`} className="object-cover w-full h-full" />
                    </div>
                    <button
                      className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-cocoa-950/80 text-cream-50 text-[0.8rem]"
                      onClick={() => set("refs", form.refs.filter((_, j) => j !== i))}
                      aria-label={`Remove reference ${i + 1}`}
                    >✕</button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}

        {step === 2 && (
          <section>
            <h1 className="display display-md">What matters to you?</h1>
            <div className="mt-5 grid gap-4">
              <div>
                <label className="field-label" htmlFor="keep">Keep these — details you love</label>
                <textarea id="keep" rows={2} className="field" value={form.mustKeep} onChange={e => set("mustKeep", e.target.value)} placeholder="e.g. the blue colour and the pearls" />
              </div>
              <div>
                <label className="field-label" htmlFor="avoid">Avoid these</label>
                <textarea id="avoid" rows={2} className="field" value={form.avoid} onChange={e => set("avoid", e.target.value)} placeholder="e.g. no fondant figures, nothing too sweet" />
              </div>
              <p className="text-[0.85rem] text-ink-soft">Everything else? We&rsquo;ll take creative licence — that&rsquo;s what you&rsquo;re paying a baker for.</p>
            </div>
          </section>
        )}

        {step === 3 && (
          <section>
            <h1 className="display display-md">Size & taste</h1>
            <div className="mt-5 grid gap-4">
              <div>
                <label className="field-label" htmlFor="serv">How many people?</label>
                <select id="serv" className="field" value={form.servings} onChange={e => set("servings", e.target.value)}>
                  {["6–8 (500 g)", "10–12 (1 kg)", "14–16 (1.5 kg)", "18–22 (2 kg)", "Bigger — tell you later"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="field-label">Flavour</label>
                <div className="flex flex-wrap gap-2">
                  {p.flavours.map(f => (
                    <button key={f} className="chip" aria-pressed={form.flavour === f} onClick={() => set("flavour", f)}>{f}</button>
                  ))}
                </div>
              </div>
              <button className="flex items-center gap-3 text-[0.95rem] w-fit" role="switch" aria-checked={form.eggless} onClick={() => set("eggless", !form.eggless)}>
                <span className="inline-block w-8 h-[18px] rounded-full border" style={{ background: form.eggless ? "var(--color-cocoa-700)" : "transparent", borderColor: "var(--color-line-strong)" }} aria-hidden>
                  <span className="block w-[14px] h-[14px] bg-cream-50 rounded-full transition-transform" style={{ transform: form.eggless ? "translateX(16px)" : "translateX(2px)", marginTop: 1 }} />
                </span>
                Eggless
              </button>
              <div>
                <label className="field-label" htmlFor="allergy">Allergies we should know about?</label>
                <input id="allergy" className="field" value={form.allergies} onChange={e => set("allergies", e.target.value)} placeholder="e.g. severe nut allergy" />
              </div>
            </div>
          </section>
        )}

        {step === 4 && (
          <section>
            <h1 className="display display-md">The look</h1>
            <p className="mt-2 text-ink-soft text-[0.95rem]">Tap any direction you like — these are all styles we&rsquo;ve actually made.</p>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {p.styleGallery.map(g => {
                const on = form.styles.includes(g.tag);
                return (
                  <button
                    key={g.tag}
                    className="text-left group"
                    aria-pressed={on}
                    onClick={() => set("styles", on ? form.styles.filter(t => t !== g.tag) : [...form.styles, g.tag])}
                  >
                    <div className="relative rounded-[4px] overflow-hidden bg-cream-200" style={{ aspectRatio: "1", outline: on ? "2px solid var(--color-cocoa-700)" : "none", outlineOffset: 2 }}>
                      <Image src={g.image} alt="" fill sizes="30vw" className="object-cover" />
                    </div>
                    <p className="mt-1.5 text-[0.85rem] leading-tight">{g.label}</p>
                  </button>
                );
              })}
            </div>
            <div className="mt-5">
              <label className="field-label" htmlFor="color">Colour notes</label>
              <input id="color" className="field" value={form.colorNotes} onChange={e => set("colorNotes", e.target.value)} placeholder="e.g. dusty pink and gold, nothing bright" />
            </div>
          </section>
        )}

        {step === 5 && (
          <section>
            <h1 className="display display-md">The words</h1>
            <div className="mt-5 grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label" htmlFor="nm">Name on the cake</label>
                  <input id="nm" className="field" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Riya" />
                </div>
                <div>
                  <label className="field-label" htmlFor="ag">Age / number</label>
                  <input id="ag" className="field num" value={form.age} onChange={e => set("age", e.target.value)} placeholder="30" />
                </div>
              </div>
              <div>
                <label className="field-label" htmlFor="msg">Message</label>
                <input id="msg" className="field" maxLength={80} value={form.message} onChange={e => set("message", e.target.value)} placeholder="Happy 30th, Riya!" />
              </div>
            </div>
          </section>
        )}

        {step === 6 && (
          <section>
            <h1 className="display display-md">What range should we design within?</h1>
            <p className="mt-2 text-ink-soft text-[0.95rem]">A budget is a design constraint, not a negotiation. It tells us what to attempt on the first draft.</p>
            <div className="mt-5 space-y-2.5">
              {BUDGETS.map(b => (
                <button
                  key={b.id}
                  className="w-full text-left border border-line rounded-[3px] px-4 py-3.5 hover:bg-cream-100 transition-colors flex justify-between items-baseline gap-3"
                  style={form.budget === b.id ? { borderColor: "var(--color-cocoa-700)", background: "var(--color-cream-100)" } : undefined}
                  aria-pressed={form.budget === b.id}
                  onClick={() => set("budget", b.id)}
                >
                  <span className="num font-medium">{b.label}</span>
                  <span className="text-[0.82rem] text-ink-soft">{b.note}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 7 && (
          <section>
            <h1 className="display display-md">Pickup or delivery?</h1>
            <div className="mt-5 grid grid-cols-2 gap-2.5">
              <button className="chip justify-center" aria-pressed={form.fulfilment === "pickup"} onClick={() => set("fulfilment", "pickup")}>Pickup — free</button>
              <button className="chip justify-center" aria-pressed={form.fulfilment === "delivery"} onClick={() => set("fulfilment", "delivery")}>Delivery in {p.city}</button>
            </div>
            {form.fulfilment === "delivery" && (
              <div className="mt-4">
                <label className="field-label" htmlFor="addr">Address</label>
                <textarea id="addr" rows={2} className="field" value={form.address} onChange={e => set("address", e.target.value)} placeholder="House / flat, street, locality, pincode" />
              </div>
            )}
          </section>
        )}

        {step === 8 && (
          <section>
            <h1 className="display display-md">Check it & send</h1>
            <dl className="mt-5 panel p-5 num text-[0.92rem] space-y-1.5">
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Occasion</dt><dd className="text-right">{form.occasion || "—"}{form.person ? ` · ${form.person}` : ""}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Date</dt><dd>{form.eventDate || "—"}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Size</dt><dd>{form.servings}{form.eggless ? " · eggless" : ""}</dd></div>
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Flavour</dt><dd>{form.flavour}</dd></div>
              {form.styles.length > 0 && <div className="flex justify-between gap-4"><dt className="text-ink-soft">Look</dt><dd className="text-right">{form.styles.join(", ")}</dd></div>}
              {form.message && <div className="flex justify-between gap-4"><dt className="text-ink-soft">Message</dt><dd className="text-right">“{form.message}”</dd></div>}
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">Budget</dt><dd>{BUDGETS.find(b => b.id === form.budget)?.label ?? "—"}</dd></div>
              {p.startDesign && <div className="flex justify-between gap-4"><dt className="text-ink-soft">Base design</dt><dd>No. {String(p.startDesign.number).padStart(2, "0")}</dd></div>}
              <div className="flex justify-between gap-4"><dt className="text-ink-soft">References</dt><dd>{form.refs.length} photo{form.refs.length === 1 ? "" : "s"}</dd></div>
            </dl>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label" htmlFor="cn">Your name *</label>
                <input id="cn" className="field" value={form.contactName} onChange={e => set("contactName", e.target.value)} />
              </div>
              <div>
                <label className="field-label" htmlFor="ph">Phone *</label>
                <input id="ph" className="field num" inputMode="numeric" maxLength={10} value={form.phone} onChange={e => set("phone", e.target.value.replace(/\D/g, ""))} />
              </div>
            </div>
            <p className="mt-3 text-[0.85rem] text-ink-soft">
              You&rsquo;ll get a private link to track the brief. Chhaya reviews it and sends a fixed quote — usually same day.
            </p>
            {error && <p className="mt-2 text-[0.9rem] text-cocoa-700" role="alert">{error}</p>}
          </section>
        )}
      </div>

      {/* nav */}
      <div className="fixed left-0 right-0 bottom-0 commerce-bar">
        <div className="mx-auto max-w-2xl flex justify-between items-center gap-3">
          <button className="btn btn-ghost" onClick={() => setStep(s => Math.max(0, s - 1))} disabled={step === 0}>Back</button>
          {step < STEP_TITLES.length - 1 ? (
            <button className="btn btn-cocoa flex-1 max-w-56" disabled={!valid} onClick={() => setStep(s => s + 1)}>Continue</button>
          ) : (
            <button className="btn btn-gold flex-1 max-w-56" disabled={!valid || busy} onClick={submit}>
              {busy ? "Sending…" : "Send for a fixed quote"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
