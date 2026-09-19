import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter({
  businessName,
  ownerName,
  phoneDisplay,
  whatsapp,
  instagram,
  address,
  mapsLink,
  city,
}: {
  businessName: string;
  ownerName: string;
  phoneDisplay: string;
  whatsapp: string;
  instagram: string;
  address: string;
  mapsLink: string;
  city: string;
}) {
  return (
    <footer className="bg-cocoa-950 text-cream-50/85 mt-24 border-t-2 border-gold-500/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-3">
            <Logo size={44} />
            <span className="display text-cream-50 text-2xl">{businessName}</span>
          </div>
          <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-cream-50/70">
            A home kitchen in Krishna Nagar, {city}. Every cake here was made by hand, after someone ordered it.
          </p>
          <p className="mt-6 text-sm text-cream-50/60">
            Run by {ownerName} · <a className="underline underline-offset-2 hover:text-gold-300" href={instagram} target="_blank" rel="noopener">@b38bakehouse</a>
          </p>
        </div>

        <nav aria-label="Footer">
          <p className="eyebrow text-gold-500 mb-4">Explore</p>
          <ul className="space-y-2.5 text-[0.95rem]">
            <li><Link className="hover:text-gold-300" href="/designs">Designs</Link></li>
            <li><Link className="hover:text-gold-300" href="/custom">Custom cake</Link></li>
            <li><Link className="hover:text-gold-300" href="/how-it-works">How it works</Link></li>
            <li><Link className="hover:text-gold-300" href="/track">Track an order</Link></li>
            <li><Link className="hover:text-gold-300" href="/faq">FAQ</Link></li>
          </ul>
        </nav>

        <div>
          <p className="eyebrow text-gold-500 mb-4">Visit & contact</p>
          <address className="not-italic space-y-2.5 text-[0.95rem]">
            <p>
              <a className="hover:text-gold-300 underline-offset-2 hover:underline" href={mapsLink} target="_blank" rel="noopener">{address}</a>
            </p>
            <p><a className="hover:text-gold-300" href={`tel:+${phoneE(whatsapp)}`}>{phoneDisplay}</a></p>
            <p><a className="hover:text-gold-300" href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener">WhatsApp us</a></p>
          </address>
        </div>
      </div>

      <div className="border-t border-cocoa-800/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between text-[0.8rem] text-cream-50/50">
          <p>© {new Date().getFullYear()} {businessName} · {city}</p>
          <p className="flex gap-4">
            <Link className="hover:text-gold-300" href="/policies/terms">Terms</Link>
            <Link className="hover:text-gold-300" href="/policies/privacy">Privacy</Link>
            <Link className="hover:text-gold-300" href="/policies/refunds">Refunds</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function phoneE(w: string) {
  return w;
}
