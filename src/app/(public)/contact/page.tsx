import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = { title: "Contact" };
export const dynamic = "force-dynamic";

export default function Contact() {
  const s = getSettings();
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-20">
      <div className="rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep">Contact</p>
        <h1 className="display display-lg mt-3">Talk to us</h1>
        <p className="mt-4 text-ink-soft max-w-md">
          WhatsApp is fastest. Chhaya answers between kitchen sessions, usually within the hour (9am to 8pm).
        </p>
      </div>

      <div className="mt-8 flex flex-wrap gap-3 rv" data-delay="100">
        <a href={`https://wa.me/${s.whatsapp}?text=${encodeURIComponent("Hi B38! ")}`} className="btn btn-primary" target="_blank" rel="noopener">WhatsApp {s.phoneDisplay}</a>
        <a href={`tel:+${s.whatsapp}`} className="btn btn-ghost">Call</a>
      </div>

      <div className="mt-10 rv rounded-[28px] bg-strawberry-tint border border-strawberry/20 p-7 sm:p-8" data-delay="160">
        <p className="eyebrow text-strawberry-deep">The kitchen</p>
        <address className="mt-4 not-italic text-[1.02rem] text-ink leading-relaxed">
          B38 Bake House<br />
          {s.address}
        </address>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] font-bold">
          <a className="underline underline-offset-4 decoration-strawberry decoration-2 hover:text-strawberry-deep" href={s.mapsLink} target="_blank" rel="noopener">Open in Maps</a>
          <a className="underline underline-offset-4 decoration-strawberry decoration-2 hover:text-strawberry-deep" href={s.instagram} target="_blank" rel="noopener">Instagram @b38bakehouse</a>
        </div>
        <p className="hand mt-5 text-[1.4rem]">one oven, one number, no call centre</p>
      </div>

      <p className="mt-6 text-[0.85rem] text-ink-soft">Pickup hours by appointment: your confirmation message includes the exact window and directions.</p>
    </div>
  );
}
