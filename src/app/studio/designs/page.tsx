import Link from "next/link";
import db from "@/lib/db";
import { formatINR } from "@/lib/money";

export const dynamic = "force-dynamic";

export default async function StudioDesigns() {
  const rows = db.prepare("SELECT * FROM designs ORDER BY number").all() as any[];

  return (
    <div>
      <div className="flex items-center justify-between gap-3"><h1 className="display display-md">Designs</h1><Link href="/studio/designs/new" className="btn btn-cocoa !py-2.5">+ Add design</Link></div>
      <p className="mt-1 text-[0.9rem] text-ink-soft">Prices, lead times and visibility — click to edit.</p>
      <ul className="mt-6 divide-y divide-line border border-line rounded-[4px] bg-[#FFFDF9]">
        {rows.map(d => (
          <li key={d.id}>
            <Link href={`/studio/designs/${d.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-cream-100 transition-colors">
              <div>
                <p className="font-medium"><span className="num text-cocoa-600 text-[0.85em]">No. {String(d.number).padStart(2, "0")}</span> {d.name}</p>
                <p className="num text-[0.85rem] text-ink-soft">1 kg {formatINR(d.base_kg_paise)} · {d.lead_hours}h notice · {d.capacity_points} pt{d.capacityPoints > 1 ? "s" : ""}</p>
              </div>
              <span className="status-pill" style={{ background: d.active ? "#E4EFE2" : "#EEE9E2", color: d.active ? "#2F5530" : "#5D4B42" }}>
                {d.active ? "live" : "hidden"}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
