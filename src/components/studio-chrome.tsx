"use client";

import { logout } from "@/lib/auth-client";

export function StudioLogout() {
  return (
    <form action="/api/studio/logout" method="post">
      <button className="text-[0.85rem] text-ink-soft hover:text-cocoa-700 underline-offset-2 hover:underline">Sign out</button>
    </form>
  );
}
