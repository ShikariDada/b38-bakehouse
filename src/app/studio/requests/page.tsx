import Link from "next/link";
import db from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function StudioRequests() {
  const rows = db.prepare("SELECT * FROM custom_requests ORDER BY id DESC LIMIT 60").all() as any[];

  return (
    <div>
      <h1 className="display display-md">Custom requests</h1>
      {rows.length === 0 ? (
        <p className="mt-6 text-ink-soft">No briefs yet. When a customer sends one, it lands here.</p>
      ) : (
        <ul className="mt-6 divide-y divide-line border border-line rounded-[4px] bg-[#FFFDF9]">
          {rows.map(r => (
            <li key={r.id}>
              <Link href={`/studio/requests/${r.id}`} className="flex items-center justify-between gap-3 p-4 hover:bg-cream-100 transition-colors">
                <div>
                  <p className="font-medium num">{r.public_code} · {r.name} · {r.phone}</p>
                  <p className="num text-[0.85rem] text-ink-soft">
                    {new Date(r.event_date + "T00:00:00").toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · {r.budget_band || "no budget given"} · {r.servings}
                  </p>
                </div>
                <span className="status-pill" style={{
                  background: r.status === "submitted" ? "#FBEBC3" : r.status === "quoted" ? "#E4EFE2" : "#EEE9E2",
                  color: r.status === "submitted" ? "#742E15" : r.status === "quoted" ? "#2F5530" : "#5D4B42",
                }}>
                  {r.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
