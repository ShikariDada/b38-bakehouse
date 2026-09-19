import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

export default function Contact() {
  const s = getSettings();
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-16">
      <p className="eyebrow text-cocoa-600">Contact</p>
      <h1 className="display display-lg mt-2">Talk to us</h1>
      <p className="mt-4 text-ink-soft max-w-md">
        WhatsApp is fastest — Chhaya answers between kitchen sessions, usually within the hour (9am–8pm).
      </p>
      <div className="mt-8 space-y-3">
        <a href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent("Hi B38! ")}`} className="btn btn-gold w-full sm:w-auto" target="_blank" rel="noopener">WhatsApp {s.phoneDisplay}</a>
        <a href={`tel:+${s.whatsapp}`} className="btn btn-ghost w-full sm:w-auto">Call</a>
      </div>
      <address className="mt-8 not-italic text-[0.95rem] text-ink-soft leading-relaxed">
        B38 Bake House<br />
        {s.address}<br />
        <a className="underline underline-offset-2 hover:text-cocoa-700" href={s.mapsLink} target="_blank" rel="noopener">Open in Maps</a>
        {" · "}
        <a className="underline underline-offset-2 hover:text-cocoa-700" href={s.instagram} target="_blank" rel="noopener">Instagram @b38bakehouse</a>
      </address>
      <p className="mt-6 text-[0.85rem] text-ink-soft">Pickup hours by appointment — your confirmation message includes the exact window and directions.</p>
    </div>
  );
}
