import db from "@/lib/db";

export const dynamic = "force-dynamic";

async function setDay(formData: FormData) {
  "use server";
  const date = String(formData.get("date"));
  const mode = String(formData.get("mode"));
  const points = Number(formData.get("points"));
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return;
  if (mode === "block") {
    db.prepare(`INSERT INTO capacity_days (date, blocked, note) VALUES (?, 1, 'Blocked from Studio')
      ON CONFLICT(date) DO UPDATE SET blocked = 1`).run(date);
  } else {
    db.prepare(`INSERT INTO capacity_days (date, max_points, blocked) VALUES (?, ?, 0)
      ON CONFLICT(date) DO UPDATE SET max_points = ?, blocked = 0`).run(date, points, points);
  }
}

export default async function StudioCapacity() {
  const days = Array.from({ length: 28 }, (_, i) => {
    const iso = new Date(Date.now() + i * 86400000).toISOString().slice(0, 10);
    const row = db.prepare("SELECT * FROM capacity_days WHERE date = ?").get(iso) as any;
    const load = (db.prepare(`
      SELECT COALESCE(SUM(capacity_points),0) pts FROM orders WHERE event_date = ? AND status NOT IN ('cancelled','expired','refunded')
    `).get(iso) as any).pts;
    return { iso, load, max: row?.blocked ? null : row?.max_points ?? 6, blocked: !!row?.blocked, override: !!row };
  });

  return (
    <div>
      <h1 className="display display-md">Capacity</h1>
      <p className="mt-1 text-[0.9rem] text-ink-soft max-w-lg">
        Each cake costs points (1 simple, 2 detailed, 3 showcase). Default oven: 6 points/day. Block a day entirely or set a custom limit.
      </p>

      <form action={setDay} className="mt-6 flex flex-wrap gap-2.5 items-end panel p-4 max-w-2xl">
        <div>
          <label htmlFor="date" className="field-label">Date</label>
          <input id="date" name="date" type="date" required className="field num" />
        </div>
        <div>
          <label htmlFor="mode" className="field-label">Action</label>
          <select id="mode" name="mode" className="field">
            <option value="block">Block entirely</option>
            <option value="limit">Set custom points</option>
          </select>
        </div>
        <div>
          <label htmlFor="points" className="field-label">Points</label>
          <input id="points" name="points" type="number" min="1" max="20" defaultValue={6} className="field num !w-24" />
        </div>
        <button className="btn btn-cocoa">Apply</button>
      </form>

      <div className="mt-7 grid grid-cols-7 gap-1.5 max-w-2xl">
        {days.map(d => (
          <div key={d.iso} className="rounded-[3px] border border-line p-2 text-center bg-[#FFFDF9]" title={d.iso}>
            <p className="num text-[0.7rem] text-ink-soft">{new Date(d.iso + "T00:00:00").getDate()}</p>
            <p className="num text-[0.85rem] font-medium" style={{ color: d.blocked ? "#8D3D1D" : d.load > 0 ? "#2F5530" : "#5D4B42" }}>
              {d.blocked ? "✕" : `${d.load}/${d.max}`}
            </p>
            {d.override && <p className="text-[0.6rem] text-gold-700">set</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
