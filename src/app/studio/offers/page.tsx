import db from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

async function createCoupon(formData: FormData) {
  "use server";
  const code = String(formData.get("code") || "").trim().toUpperCase().replace(/[^A-Z0-9]/g, "");
  const kind = String(formData.get("kind") || "percent");
  const value = Number(formData.get("value"));
  const minSpend = Math.round(Number(formData.get("minSpendRupees") || 0) * 100);
  const maxDiscount = Math.round(Number(formData.get("maxDiscountRupees") || 0) * 100);
  const usageLimit = Number(formData.get("usageLimit")) || null;
  const endsAt = String(formData.get("endsAt") || "") || null;
  if (!code || !Number.isFinite(value) || value <= 0) return;
  if (kind === "percent" && value > 100) return;
  db.prepare(`
    INSERT INTO coupons (code, kind, value, min_spend_paise, max_discount_paise, usage_limit, ends_at, active)
    VALUES (?, ?, ?, ?, ?, ?, ?, 1)
    ON CONFLICT(code) DO UPDATE SET kind=excluded.kind, value=excluded.value, active=1
  `).run(code, kind, value, minSpend, kind === "percent" && maxDiscount > 0 ? maxDiscount : null, usageLimit, endsAt);
}

async function toggle(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  db.prepare("UPDATE coupons SET active = 1 - active WHERE id = ?").run(id);
}

export default function StudioOffers() {
  const rows = db.prepare("SELECT * FROM coupons ORDER BY id DESC").all() as any[];

  return (
    <div>
      <h1 className="display display-md">Offers</h1>
      <p className="mt-1 text-[0.9rem] text-ink-soft max-w-lg">
        Coupon codes customers can type at checkout. Percent codes can carry a cap so a birthday giveaway never eats the margin.
      </p>

      <form action={createCoupon} className="mt-6 panel p-5 grid gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="code" className="field-label">Code</label>
          <input id="code" name="code" required className="field num uppercase" placeholder="DIWALI10" />
        </div>
        <div>
          <label htmlFor="kind" className="field-label">Type</label>
          <select id="kind" name="kind" className="field">
            <option value="percent">Percent off</option>
            <option value="flat">Flat ₹ off</option>
          </select>
        </div>
        <div>
          <label htmlFor="value" className="field-label">Value (₹ or %)</label>
          <input id="value" name="value" type="number" min="1" required className="field num" placeholder="10" />
        </div>
        <div>
          <label htmlFor="min" className="field-label">Min order ₹</label>
          <input id="min" name="minSpendRupees" type="number" min="0" defaultValue={0} className="field num" />
        </div>
        <div>
          <label htmlFor="cap" className="field-label">Max discount ₹ <span className="font-normal text-ink-soft">(percent only)</span></label>
          <input id="cap" name="maxDiscountRupees" type="number" min="0" defaultValue={0} className="field num" />
        </div>
        <div>
          <label htmlFor="limit" className="field-label">Usage limit</label>
          <input id="limit" name="usageLimit" type="number" min="1" className="field num" placeholder="unlimited" />
        </div>
        <div>
          <label htmlFor="ends" className="field-label">Ends on</label>
          <input id="ends" name="endsAt" type="date" className="field num" />
        </div>
        <div className="flex items-end">
          <button className="btn btn-cocoa w-full md:w-auto">Create offer</button>
        </div>
      </form>

      {rows.length > 0 && (
        <ul className="mt-7 divide-y divide-line border border-line rounded-[16px] bg-[#FFFDF8]">
          {rows.map(c => (
            <li key={c.id} className="p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="num font-black tracking-wide">{c.code}</p>
                <p className="num text-[0.85rem] text-ink-soft">
                  {c.kind === "percent" ? `${c.value}% off` : `${formatINR(c.value)} off`}
                  {c.min_spend_paise > 0 && ` · min ${formatINR(c.min_spend_paise)}`}
                  {c.max_discount_paise && ` · cap ${formatINR(c.max_discount_paise)}`}
                  {c.usage_limit && ` · used ${c.used_count}/${c.usage_limit}`}
                  {c.ends_at && ` · till ${new Date(c.ends_at + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="status-pill" style={{ background: c.active ? "#E4EFE2" : "#EEE9E2", color: c.active ? "#2F5530" : "#5D4B42" }}>
                  {c.active ? "live" : "paused"}
                </span>
                <form action={toggle}>
                  <input type="hidden" name="id" value={c.id} />
                  <button className="btn btn-ghost !py-2 !px-4 text-[0.85rem]">{c.active ? "Pause" : "Resume"}</button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
