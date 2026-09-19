import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { isStudioAuthed } from "@/lib/auth";

// Customer reference images are private: only the studio can view them.
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  if (!(await isStudioAuthed())) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { file } = await params;
  if (!/^[a-zA-Z0-9._-]+$/.test(file)) return NextResponse.json({ error: "bad name" }, { status: 400 });
  const p = path.join(process.cwd(), "data", "uploads", file);
  if (!fs.existsSync(p)) return NextResponse.json({ error: "not found" }, { status: 404 });
  const buf = fs.readFileSync(p);
  return new NextResponse(buf, { headers: { "content-type": file.endsWith(".png") ? "image/png" : "image/jpeg", "cache-control": "private, max-age=300" } });
}
