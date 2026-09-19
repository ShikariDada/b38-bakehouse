import { createHmac } from "node:crypto";
import { cookies } from "next/headers";

const PASSWORD = process.env.STUDIO_PASSWORD || "b38-demo";
const COOKIE = "studio_auth";

export function sessionValue(): string {
  return createHmac("sha256", PASSWORD).update("studio-session-v1").digest("hex");
}

export async function isStudioAuthed(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === sessionValue();
}

export async function login(password: string): Promise<boolean> {
  if (password !== PASSWORD) return false;
  const jar = await cookies();
  jar.set(COOKIE, sessionValue(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 14,
    path: "/",
  });
  return true;
}

export async function logout() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
