import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { getStudioAction } from "@/lib/studio-actions";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

async function sendQuote(formData: FormData) {
  "use server";
  getStudioAction().sendQuote(formData);
}

async function decline(formData: FormData) {
  "use server";
  getStudioAction().declineRequest(formData);
}

export default async function StudioRequest({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const r = db.prepare("SELECT * FROM custom_requests WHERE id = ?").get(id) as any;
  if (!r) notFound();
  const s = getSettings();
  const refs = JSON.parse(r.refs_json || "[]") as string[];
  const quotes = db.prepare("SELECT * FROM quotes WHERE request_id = ? ORDER BY version DESC").all(r.id) as any[];

  const suggestedLow = 100000;
  const suggestedHigh = 160000;

  return (
    <div>
      <Link href="/studio/requests" className="text-[0.88rem] text-ink-soft underline-offset-2 hover:underline">← Requests</Link>
      <h1 className="display display-md mt-3 num">{r.public_code}</h1>
      <p className="num text-[0.9rem] text-ink-soft mt-1">{r.name} · {r.phone} · sent {new Date(r.created_at + "Z").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="panel p-5">
          <h2 className="eyebrow text-cocoa-600">The brief</h2>
          <dl className="num mt-3 text-[0.92rem] space-y-1.5">
            <div className="flex justify-between gap-4"><dt className="text-ink-soft">Occasion</dt><dd className="text-right">{r.occasion}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-soft">Needed by</dt><dd>{new Date(r.event_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long" })}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-soft">Servings</dt><dd>{r.servings}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-soft">Flavour</dt><dd>{r.flavour}{r.eggless ? " · eggless" : ""}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-soft">Budget band</dt><dd>{r.budget_band || "—"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-ink-soft">Fulfilment</dt><dd>{r.fulfilment}</dd></div>
          </dl>
          {r.must_keep && <p className="mt-3 text-[0.92rem]"><span className="text-ink-soft">Keep: </span>{r.must_keep}</p>}
          {r.avoid && <p className="mt-1.5 text-[0.92rem]"><span className="text-ink-soft">Avoid: </span>{r.avoid}</p>}
          {r.message_text && <p className="mt-1.5 text-[0.92rem]"><span className="text-ink-soft">Notes: </span>{r.message_text}</p>}
          {refs.length > 0 && (
            <div className="mt-4">
              <p className="eyebrow text-cocoa-600">References</p>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {refs.map(f => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={f} src={`/api/uploads/${f.split("uploads/")[1]}`} alt="Customer reference" className="rounded-[3px] w-full" style={{ aspectRatio: "1", objectFit: "cover" }} />
                ))}
              </div>
            </div>
          )}
        </section>

        <section className="panel p-5">
          <h2 className="eyebrow text-cocoa-600">Compose quote</h2>
          {r.status === "quoted" && <p className="mt-2 text-[0.85rem] text-cocoa-700">A quote was sent. Sending again creates version {quotes.length + 1}.</p>}
          <form action={sendQuote} className="mt-3 grid gap-4">
            <input type="hidden" name="requestId" value={r.id} />
            <div>
              <label htmlFor="spec" className="field-label">What you&rsquo;ll make (the customer sees this)</label>
              <textarea id="spec" name="spec" rows={5} className="field" defaultValue={r.message_text || ""} placeholder={"e.g. Two-tier lavender ombre like No. 19, fresh flowers on top, 1.5 kg chocolate, eggless."} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="total" className="field-label">Total ₹</label>
                <input id="total" name="totalRupees" type="number" min="1" required className="field num" defaultValue={Math.round(suggestedHigh / 100)} />
              </div>
              <div>
                <label htmlFor="dep" className="field-label">Deposit %</label>
                <input id="dep" name="depositPct" type="number" min="0" max="100" className="field num" defaultValue={s.depositPercent} />
              </div>
              <div>
                <label htmlFor="exp" className="field-label">Valid (days)</label>
                <input id="exp" name="expiryDays" type="number" min="1" max="14" className="field num" defaultValue={s.quoteExpiryDays} />
              </div>
            </div>
            <p className="text-[0.8rem] text-ink-soft">Internal guess range: {Math.round(suggestedLow / 100)}–{Math.round(suggestedHigh / 100)} ₹. Trust your judgement over the range.</p>
            <button className="btn btn-gold" disabled={r.status === "declined"}>Send quote to {r.name}</button>
            <p className="text-[0.8rem] text-ink-soft">
              After sending, share the customer&rsquo;s tracking link: <span className="num">/request/…</span> — it&rsquo;s on their confirmation. They accept and pay the deposit online.
            </p>
          </form>

          {r.status === "submitted" && (
            <form action={decline} className="mt-4 border-t border-line pt-4">
              <input type="hidden" name="requestId" value={r.id} />
              <button className="text-[0.85rem] text-ink-soft underline underline-offset-2">Can&rsquo;t take this — decline politely</button>
            </form>
          )}

          {quotes.length > 0 && (
            <div className="mt-5 border-t border-line pt-4">
              <h3 className="eyebrow text-cocoa-600">Quote history</h3>
              <ul className="num mt-2 space-y-1 text-[0.88rem]">
                {quotes.map(q => (
                  <li key={q.id}>v{q.version} · {q.status} · ₹{q.total_paise / 100} · {q.sent_at ? new Date(q.sent_at + "Z").toLocaleDateString("en-IN") : "draft"}</li>
                ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
