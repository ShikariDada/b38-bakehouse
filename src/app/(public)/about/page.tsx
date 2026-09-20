import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "About: Chhaya Savargaonkar's home kitchen",
  description: "B38 Bake House is a home kitchen in Krishna Nagar, Mathura, run by Chhaya Savargaonkar. Every cake is made to order, by hand.",
};

export const dynamic = "force-dynamic";

export default function About() {
  const s = getSettings();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-20">
      <div className="grid md:grid-cols-[45%_55%] gap-10 items-start">
        <div className="rv" data-delay="0">
          <p className="eyebrow text-strawberry-deep">About</p>
          <h1 className="display display-lg mt-3">A kitchen, not a factory</h1>
          <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-ink-soft max-w-prose">
            <p>
              B38 Bake House is {s.ownerName}&rsquo;s home kitchen in Krishna Nagar, {s.city}. The name is the address: <span className="text-ink">38-B</span>.
            </p>
            <p>
              Every cake on this site is a real one she has already made, piped by hand, one rosette and one fringe strand at a time. There&rsquo;s no stock, no display fridge, no catalogue of other people&rsquo;s photos. When you order, your cake starts as butter and sugar the day it&rsquo;s due.
            </p>
            <p>
              The way B38 works is deliberately un-mall: fixed prices you can see, a date that&rsquo;s actually free, and a short honest conversation only when a design genuinely needs it.
            </p>
          </div>
          <p className="hand mt-6 text-[1.5rem]">small kitchen. real butter. honest prices.</p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/designs" className="btn btn-primary">See the designs</Link>
            <a href={s.instagram} className="btn btn-ghost" target="_blank" rel="noopener">@b38bakehouse</a>
          </div>
          <address className="mt-8 not-italic num text-[0.92rem] text-ink-soft">
            {s.address}<br />
            <a className="underline underline-offset-2 hover:text-strawberry-deep" href={s.mapsLink} target="_blank" rel="noopener">Directions</a>
            {" · "}
            <a className="underline underline-offset-2 hover:text-strawberry-deep" href={`tel:+${s.whatsapp}`}>{s.phoneDisplay}</a>
          </address>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="rv-img relative rounded-[20px] overflow-hidden bg-vanilla-deep rotate-[-1.5deg]" data-delay="80" style={{ aspectRatio: "4/5" }}>
            <Image src="/media/hero/macro-fringe.webp" alt="Vintage fringe piping in progress" fill sizes="(max-width:768px) 46vw, 26vw" className="object-cover" />
          </div>
          <div className="rv-img relative rounded-[20px] overflow-hidden bg-vanilla-deep mt-8 rotate-[1.5deg]" data-delay="160" style={{ aspectRatio: "4/5" }}>
            <Image src="/media/hero/macro-petals.webp" alt="Hand-piped petals" fill sizes="(max-width:768px) 46vw, 26vw" className="object-cover" />
          </div>
          <div className="rv-img relative rounded-[20px] overflow-hidden bg-vanilla-deep -mt-2 rotate-[1.5deg]" data-delay="240" style={{ aspectRatio: "4/5" }}>
            <Image src="/media/hero/macro-drip.webp" alt="Ganache drip detail" fill sizes="(max-width:768px) 46vw, 26vw" className="object-cover" />
          </div>
          <div className="rv-img relative rounded-[20px] overflow-hidden bg-vanilla-deep mt-6 rotate-[-1.5deg]" data-delay="300" style={{ aspectRatio: "4/5" }}>
            <Image src="/media/designs/lavender-ombre-pearls/photo-25-card-sm.webp" alt="Lavender ombre cake" fill sizes="(max-width:768px) 46vw, 26vw" className="object-cover" />
          </div>
        </div>
      </div>
    </div>
  );
}
