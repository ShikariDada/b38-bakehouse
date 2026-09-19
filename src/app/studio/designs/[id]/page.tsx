import Link from "next/link";
import { notFound } from "next/navigation";
import db from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

async function save(formData: FormData) {
  "use server";
  const id = Number(formData.get("id"));
  const name = String(formData.get("name") || "").slice(0, 80);
  const tagline = String(formData.get("tagline") || "").slice(0, 300);
  const baseKg = Math.round(Number(formData.get("baseKgRupees")) * 100);
  const leadHours = Number(formData.get("leadHours"));
  const rush = formData.get("rush") === "on" ? 1 : 0;
  const active = formData.get("active") === "on" ? 1 : 0;
  const featured = formData.get("featured") === "on" ? 1 : 0;
  if (!name || !Number.isFinite(baseKg) || baseKg <= 0 || !Number.isFinite(leadHours)) return;
  db.prepare(`
    UPDATE designs SET name = ?, tagline = ?, base_kg_paise = ?, lead_hours = ?, rush_allowed = ?, active = ?, featured = ?, updated_at = datetime('now')
    WHERE id = ?
  `).run(name, tagline, baseKg, leadHours, rush, active, featured, id);
}

export default async function StudioDesign({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = db.prepare("SELECT * FROM designs WHERE id = ?").get(id) as any;
  if (!d) notFound();

  return (
    <div>
      <Link href="/studio/designs" className="text-[0.88rem] text-ink-soft underline-offset-2 hover:underline">← Designs</Link>
      <h1 className="display display-md mt-3">
        <span className="num text-cocoa-600 text-[0.7em]">No. {String(d.number).padStart(2, "0")}</span> {d.name}
      </h1>

      <form action={save} className="mt-6 grid gap-5 max-w-xl panel p-5">
        <input type="hidden" name="id" value={d.id} />
        <div>
          <label htmlFor="name" className="field-label">Name</label>
          <input id="name" name="name" className="field" defaultValue={d.name} required />
        </div>
        <div>
          <label htmlFor="tag" className="field-label">Tagline</label>
          <textarea id="tag" name="tagline" rows={2} className="field" defaultValue={d.tagline} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="price" className="field-label">1 kg price ₹ <span className="font-normal text-ink-soft">(smaller sizes derive from this)</span></label>
            <input id="price" name="baseKgRupees" type="number" min="1" className="field num" defaultValue={d.base_kg_paise / 100} required />
            <p className="num mt-1 text-[0.78rem] text-ink-soft">500 g shows as {formatINR(Math.round(d.base_kg_paise * 0.6 / 5000) * 5000)}</p>
          </div>
          <div>
            <label htmlFor="lead" className="field-label">Lead time (hours)</label>
            <input id="lead" name="leadHours" type="number" min="24" step="24" className="field num" defaultValue={d.lead_hours} />
          </div>
        </div>
        <div className="flex gap-6 text-[0.95rem]">
          <label className="flex items-center gap-2"><input type="checkbox" name="rush" defaultChecked={!!d.rush_allowed} /> Rush possible (+15%)</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="active" defaultChecked={!!d.active} /> Visible on site</label>
          <label className="flex items-center gap-2"><input type="checkbox" name="featured" defaultChecked={!!d.featured} /> Featured</label>
        </div>
        <button className="btn btn-cocoa w-fit">Save changes</button>
      </form>
    </div>
  );
}
