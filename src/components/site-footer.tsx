import Link from "next/link";
import Image from "next/image";

export function SiteFooter({
  businessName, ownerName, phoneDisplay, whatsapp, instagram, address, mapsLink, city,
}: {
  businessName: string; ownerName: string; phoneDisplay: string; whatsapp: string;
  instagram: string; address: string; mapsLink: string; city: string;
}) {
  return (
    <footer className="bg-choc-deep text-vanilla mt-24">
      <div className="marquee border-b border-vanilla/10 py-4" aria-hidden>
        <div className="marquee-track display text-[1.5rem] text-butter/90">
          {Array.from({ length: 2 }).map((_, half) => (
            <span key={half} className="flex gap-12 shrink-0">
              {["Baked to order", "Fresh in Mathura", "Eggless anything", "Fixed prices", "Real buttercream"].map(t => (
                <span key={t} className="flex items-center gap-12">
                  {t} <span className="text-strawberry not-italic">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="" width={48} height={48} className="rounded-full" />
            <span className="display text-2xl">{businessName}</span>
          </div>
          <p className="mt-4 max-w-sm text-vanilla/70 leading-relaxed">
            Chhaya&rsquo;s home kitchen in Krishna Nagar, {city}. No display case, no day-old shelf. Your cake starts the day it&rsquo;s due.
          </p>
          <p className="hand mt-5 text-[1.5rem] text-butter">see you at the party</p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow text-butter !text-[0.7rem] mb-4">Explore</p>
          <ul className="space-y-2.5 text-[0.95rem] text-vanilla/80">
            <li><Link className="hover:text-butter transition-colors" href="/designs">Designs</Link></li>
            <li><Link className="hover:text-butter transition-colors" href="/custom">Custom cake</Link></li>
            <li><Link className="hover:text-butter transition-colors" href="/how-it-works">How it works</Link></li>
            <li><Link className="hover:text-butter transition-colors" href="/track">Track an order</Link></li>
            <li><Link className="hover:text-butter transition-colors" href="/faq">FAQ</Link></li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-butter !text-[0.7rem] mb-4">Visit &amp; contact</p>
          <address className="not-italic space-y-2.5 text-[0.95rem] text-vanilla/80">
            <p><a className="hover:text-butter transition-colors underline-offset-2 hover:underline" href={mapsLink} target="_blank" rel="noopener">{address}</a></p>
            <p><a className="hover:text-butter transition-colors" href={`tel:+${whatsapp}`}>{phoneDisplay}</a></p>
            <p><a className="hover:text-butter transition-colors" href={instagram} target="_blank" rel="noopener">@b38bakehouse</a></p>
          </address>
        </div>
      </div>

      <div className="border-t border-vanilla/10">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[0.8rem] text-vanilla/45">
          <p>© {new Date().getFullYear()} {businessName} · run by {ownerName}</p>
          <p className="flex gap-4">
            <Link className="hover:text-butter" href="/policies/terms">Terms</Link>
            <Link className="hover:text-butter" href="/policies/privacy">Privacy</Link>
            <Link className="hover:text-butter" href="/policies/refunds">Refunds</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
