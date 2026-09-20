import { notFound, redirect } from "next/navigation";
import db from "@/lib/db";
import { hashToken, orderCode, trackingToken } from "@/lib/tokens";
import { formatINR } from "@/lib/money";
import { getSettings } from "@/lib/settings";
import { canAccept } from "@/lib/capacity";

export const dynamic = "force-dynamic";

async function acceptQuote(formData: FormData) {
  "use server";
  const token = String(formData.get("token"));
  const req = db.prepare("SELECT id, public_code, event_date FROM custom_requests WHERE tracking_token_hash = ?").get(hashToken(token)) as { id: number; public_code: string; event_date: string } | undefined;
  if (!req) notFound();

  const quote = db
    .prepare("SELECT * FROM quotes WHERE request_id = ? AND status IN ('sent','accepted') ORDER BY version DESC LIMIT 1")
    .get(req.id) as { id: number; total_paise: number; deposit_paise: number; spec_json: string; delivery_paise: number; status: string; expires_at: string | null } | undefined;
  if (!quote) notFound();
  if (quote.expires_at && new Date(quote.expires_at + "Z") < new Date()) redirect(`/request/${token}?expired=1`);

  const spec = JSON.parse(quote.spec_json);
  const cust = db.prepare("SELECT name, phone FROM custom_requests WHERE id = ?").get(req.id) as { name: string; phone: string };

  const code = orderCode();
  const orderToken = trackingToken();
  const info = db.prepare(`
    INSERT INTO orders (public_code, tracking_token_hash, order_type, quote_id, customer_name, phone,
      event_date, fulfilment, spec_json, status, capacity_points, subtotal_paise, delivery_paise, total_paise)
    VALUES (?, ?, 'bespoke', ?, ?, ?, ?, (SELECT fulfilment FROM custom_requests WHERE id = ?), ?, 'awaiting_payment', 2, ?, ?, ?)
  `).run(
    code, hashToken(orderToken), quote.id, cust.name, cust.phone,
    req.event_date, req.id,
    JSON.stringify({ quoteSpec: spec, requestId: req.public_code, depositPaise: quote.deposit_paise }),
    quote.total_paise - quote.delivery_paise, quote.delivery_paise,
    quote.total_paise - quote.deposit_paise, // due now = deposit
  );
  db.prepare("UPDATE quotes SET status = 'accepted' WHERE id = ?").run(quote.id);
  db.prepare("INSERT INTO order_events (order_id, to_status, note) VALUES (?, 'awaiting_payment', ?)").run(info.lastInsertRowid, `Quote accepted · deposit ${formatINR(quote.deposit_paise)} due`);
  void canAccept;
  redirect(`/checkout/${code}?t=${orderToken}`);
}

export default async function RequestPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const req = db
    .prepare("SELECT * FROM custom_requests WHERE tracking_token_hash = ?")
    .get(hashToken(token)) as {
      id: number; public_code: string; status: string; occasion: string; event_date: string;
      message_text: string; budget_band: string; refs_json: string;
    } | undefined;

  if (!req) notFound();

  const s = getSettings();
  const quote = db
    .prepare("SELECT * FROM quotes WHERE request_id = ? AND status IN ('sent','accepted') ORDER BY version DESC LIMIT 1")
    .get(req.id) as { id: number; total_paise: number; deposit_paise: number; expires_at: string; spec_json: string; status: string } | undefined;

  const dateLabel = req.event_date
    ? new Date(req.event_date + "T00:00:00").toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })
    : "";

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-24">
      <div className="rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep">Request {req.public_code}</p>
      </div>

      {quote ? (
        <>
          <h1 className="display display-md mt-3">
            {quote.status === "accepted" ? "Quote accepted" : "Your quote is ready"}
          </h1>
          {quote.status !== "accepted" && (
            <p className="mt-3 text-ink-soft max-w-md">Everything below was written for your brief. Accept and pay the deposit to put it on the calendar.</p>
          )}
          <div className="mt-6 rounded-[24px] bg-cream border border-line p-6 rv" data-delay="100">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="eyebrow text-strawberry-deep">Fixed price</h2>
              <p className="num display display-sm">{formatINR(quote.total_paise)}</p>
            </div>
            <p className="num mt-1 text-[0.88rem] text-ink-soft">
              {formatINR(quote.deposit_paise)} deposit now · balance before pickup/delivery
            </p>
            <p className="num mt-2 text-[0.85rem] text-strawberry-deep">
              {quote.status === "accepted"
                ? "Accepted. Finish the deposit payment to confirm your date."
                : quote.expires_at && new Date(quote.expires_at + "Z") < new Date()
                  ? "This quote has expired because availability changes. Ask us for a fresh one."
                  : `Valid until ${new Date(quote.expires_at + "Z").toLocaleDateString("en-IN", { day: "numeric", month: "long" })}`}
            </p>
            {quote.status !== "accepted" && (
              <form action={acceptQuote} className="mt-5">
                <input type="hidden" name="token" value={token} />
                <button className="btn btn-primary w-full sm:w-auto" disabled={!!(quote.expires_at && new Date(quote.expires_at + "Z") < new Date())}>
                  Accept & pay {formatINR(quote.deposit_paise)} deposit
                </button>
              </form>
            )}
          </div>
          <div className="mt-5 rounded-[24px] bg-cream border border-line p-6">
            <h2 className="eyebrow text-strawberry-deep">The specification</h2>
            <pre className="mt-4 whitespace-pre-wrap font-sans text-[0.92rem] leading-relaxed text-ink">
              {typeof quote.spec_json === "string" ? (() => { try { return (JSON.parse(quote.spec_json) as { spec: string }).spec || quote.spec_json; } catch { return quote.spec_json; } })() : ""}
            </pre>
          </div>
        </>
      ) : (
        <>
          <h1 className="display display-md mt-3">Your brief is with Chhaya</h1>
          <p className="mt-3 text-ink-soft max-w-md">
            She reviews every brief personally: you&rsquo;ll have a fixed quote, usually within a day. This page will show it the moment it&rsquo;s ready.
          </p>
        </>
      )}

      <div className="mt-6 rounded-[24px] bg-cream border border-line p-6 num text-[0.92rem] space-y-1.5">
        <div className="flex justify-between gap-4"><dt className="text-ink-soft">Occasion</dt><dd className="text-right">{req.occasion}</dd></div>
        <div className="flex justify-between gap-4"><dt className="text-ink-soft">Date</dt><dd>{dateLabel}</dd></div>
        {req.budget_band && <div className="flex justify-between gap-4"><dt className="text-ink-soft">Budget range</dt><dd>{req.budget_band}</dd></div>}
        <div className="flex justify-between gap-4"><dt className="text-ink-soft">References</dt><dd>{JSON.parse(req.refs_json).length} photo(s)</dd></div>
        {req.message_text && <div className="pt-2 border-t border-line"><dt className="text-ink-soft">Brief</dt><dd className="mt-1 font-sans">{req.message_text}</dd></div>}
      </div>

      <div className="mt-8">
        <a
          href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent(`Hi B38, I'm asking about request ${req.public_code}.`)}`}
          className="btn btn-ghost" target="_blank" rel="noopener"
        >
          Ask about this request
        </a>
      </div>
    </div>
  );
}
