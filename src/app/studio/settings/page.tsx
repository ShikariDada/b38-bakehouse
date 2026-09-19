import { getSettings, setSetting } from "@/lib/settings";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

async function save(formData: FormData) {
  "use server";
  const keys = [
    "businessName", "ownerName", "phoneDisplay", "whatsapp", "instagram",
    "address", "mapsLink", "city", "upiVpa", "upiPayeeName", "fssaiNumber",
    "defaultCapacityPoints", "defaultLeadHours", "depositPercent", "quoteExpiryDays",
  ];
  for (const k of keys) {
    const v = formData.get(k);
    if (v !== null) setSetting(k, String(v).trim());
  }
}

async function setZone(formData: FormData) {
  "use server";
  const id = Number(formData.get("zoneId"));
  const fee = Math.round(Number(formData.get("feeRupees")) * 100);
  const active = formData.get("active") === "on" ? 1 : 0;
  if (Number.isFinite(fee) && fee >= 0) {
    db.prepare("UPDATE delivery_zones SET fee_paise = ?, active = ? WHERE id = ?").run(fee, active, id);
  }
}

export default async function StudioSettings() {
  const s = getSettings();
  const zones = db.prepare("SELECT * FROM delivery_zones").all() as any[];

  return (
    <div>
      <h1 className="display display-md">Settings</h1>

      <form action={save} className="mt-6 panel p-5 max-w-2xl grid gap-4">
        <h2 className="eyebrow text-cocoa-600">Business</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {([["businessName", "Business name"], ["ownerName", "Owner"], ["phoneDisplay", "Phone (display)"], ["whatsapp", "WhatsApp (91…)", "num"], ["city", "City"]] as const).map(([k, label, cls]) => (
            <div key={k}>
              <label htmlFor={k} className="field-label">{label}</label>
              <input id={k} name={k} className={`field ${cls === "num" ? "num" : ""}`} defaultValue={(s as any)[k]} />
            </div>
          ))}
          <div>
            <label htmlFor="address" className="field-label">Address</label>
            <input id="address" name="address" className="field" defaultValue={s.address} />
          </div>
          <div>
            <label htmlFor="instagram" className="field-label">Instagram URL</label>
            <input id="instagram" name="instagram" className="field" defaultValue={s.instagram} />
          </div>
          <div>
            <label htmlFor="mapsLink" className="field-label">Maps link (pickup)</label>
            <input id="mapsLink" name="mapsLink" className="field" defaultValue={s.mapsLink} />
          </div>
        </div>

        <h2 className="eyebrow text-cocoa-600 mt-3">Payments & compliance</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="upiVpa" className="field-label">Direct-UPI VPA <span className="font-normal text-ink-soft">(optional manual fallback)</span></label>
            <input id="upiVpa" name="upiVpa" className="field num" defaultValue={s.upiVpa} placeholder="b38bakehouse@upi" />
          </div>
          <div>
            <label htmlFor="upiPayee" className="field-label">UPI payee name</label>
            <input id="upiPayee" name="upiPayeeName" className="field" defaultValue={s.upiPayeeName} />
          </div>
          <div>
            <label htmlFor="fssai" className="field-label">FSSAI number <span className="font-normal text-ink-soft">(shown once filled)</span></label>
            <input id="fssai" name="fssaiNumber" className="field num" defaultValue={s.fssaiNumber} />
          </div>
        </div>

        <h2 className="eyebrow text-cocoa-600 mt-3">Rules</h2>
        <div className="grid sm:grid-cols-4 gap-4">
          {([["defaultCapacityPoints", "Daily points"], ["defaultLeadHours", "Lead (h)"], ["depositPercent", "Deposit %"], ["quoteExpiryDays", "Quote days"]] as const).map(([k, label]) => (
            <div key={k}>
              <label htmlFor={k} className="field-label">{label}</label>
              <input id={k} name={k} type="number" className="field num" defaultValue={(s as any)[k]} />
            </div>
          ))}
        </div>
        <button className="btn btn-cocoa w-fit">Save settings</button>
      </form>

      <section className="mt-8 max-w-2xl">
        <h2 className="eyebrow text-cocoa-600">Delivery zones</h2>
        <div className="mt-3 space-y-2">
          {zones.map(z => (
            <form key={z.id} action={setZone} className="panel p-4 flex flex-wrap items-end gap-3">
              <input type="hidden" name="zoneId" value={z.id} />
              <p className="flex-1 min-w-48 text-[0.92rem]">{z.name} <span className="num text-ink-soft">({z.pincodes})</span></p>
              <div>
                <label className="field-label !mb-1" htmlFor={`fee-${z.id}`}>Fee ₹</label>
                <input id={`fee-${z.id}`} name="feeRupees" type="number" min="0" className="field num !w-24" defaultValue={z.fee_paise / 100} />
              </div>
              <label className="flex items-center gap-2 text-[0.9rem] pb-2"><input type="checkbox" name="active" defaultChecked={!!z.active} /> Active</label>
              <button className="btn btn-ghost !py-2">Save</button>
            </form>
          ))}
        </div>
      </section>

      <section className="mt-8 max-w-2xl panel p-5">
        <h2 className="eyebrow text-cocoa-600">Go-live checklist</h2>
        <ul className="mt-3 space-y-1.5 text-[0.92rem]">
          <li>{s.fssaiNumber ? "✅" : "☐"} FSSAI number added (verify on FoSCoS before enabling checkout publicly)</li>
          <li>{s.upiVpa ? "✅" : "☐"} Direct-UPI VPA filled (optional) — or connect a real gateway (Cashfree etc.)</li>
          <li>☐ Delivery zone fees confirmed for real</li>
          <li>☐ Policies pages reviewed (terms, refunds, privacy)</li>
        </ul>
      </section>
    </div>
  );
}
