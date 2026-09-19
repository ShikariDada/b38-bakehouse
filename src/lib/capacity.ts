import db from "./db";
import { getSettings } from "./settings";

export type DayAvailability = {
  date: string;
  remainingPoints: number;
  maxPoints: number;
  blocked: boolean;
  note?: string;
};

// Soft holds: orders sitting in `awaiting_payment` reserve their date's capacity
// until the hold expires (30 min), so two people can't book the last slot simultaneously.
export function dayLoad(date: string): number {
  const held = db
    .prepare(
      `SELECT COALESCE(SUM(capacity_points), 0) AS pts FROM orders
       WHERE event_date = ? AND status NOT IN ('cancelled','expired','refunded','cancelled_refunded')
       AND (status != 'awaiting_payment' OR updated_at >= datetime('now', '-30 minutes'))`,
    )
    .get(date) as { pts: number };
  return held.pts;
}

export function dayMax(date: string): number {
  const row = db.prepare("SELECT max_points, blocked FROM capacity_days WHERE date = ?").get(date) as
    | { max_points: number | null; blocked: number }
    | undefined;
  if (row?.blocked) return -1;
  return row?.max_points ?? getSettings().defaultCapacityPoints;
}

export function availabilityFor(date: string, pointsNeeded: number): DayAvailability {
  const max = dayMax(date);
  if (max < 0) return { date, remainingPoints: 0, maxPoints: 0, blocked: true };
  const load = dayLoad(date);
  return { date, remainingPoints: Math.max(0, max - load), maxPoints: max, blocked: false };
}

export function availableDates(designLeadHours: number, designPoints: number, days = 21): { available: DayAvailability[]; firstAvailable: string | null } {
  const out: DayAvailability[] = [];
  const start = new Date(Date.now() + designLeadHours * 3600000);
  for (let i = 0; i < days; i++) {
    const d = new Date(start.getTime() + i * 86400000);
    const iso = d.toISOString().slice(0, 10);
    out.push(availabilityFor(iso, designPoints));
  }
  const first = out.find(a => !a.blocked && a.remainingPoints >= designPoints);
  return { available: out, firstAvailable: first?.date ?? null };
}

export function canAccept(date: string, points: number): boolean {
  const a = availabilityFor(date, points);
  return !a.blocked && a.remainingPoints >= points;
}
