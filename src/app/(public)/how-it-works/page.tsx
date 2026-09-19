import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "How it works — prices, dates, payment",
  description: "Lead times, delivery zones, payment methods and the ordering process at B38 Bake House, Mathura.",
};

export const dynamic = "force-dynamic";

export default function HowItWorks() {
  const s = getSettings();
  const zones = [
    ["Mathura city — Krishna Nagar, Civil Lines, Holipura, Dampier Nagar", "₹99"],
    ["Greater Mathura — Ramanreti, Gopeshwar, Sonkh Road", "₹149"],
    ["Vrindavan", "₹199"],
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-16">
      <p className="eyebrow text-cocoa-600">How it works</p>
      <h1 className="display display-lg mt-2">The honest version</h1>

      <section className="mt-10">
        <h2 className="display-sm">Two doors, one kitchen</h2>
        <div className="mt-3 space-y-3 text-[1rem] text-ink-soft leading-relaxed">
          <p><strong className="text-ink">Door 1 — Designs.</strong> Pick any cake from the archive, choose size, flavour, eggless, the message and your date. The price updates as you choose and that exact total is what you pay.</p>
          <p><strong className="text-ink">Door 2 — Custom.</strong> Send a brief (with references if you have them). Chhaya replies with a fixed quote — accept it and pay the deposit, or don&rsquo;t. No obligation either way.</p>
        </div>
      </section>

      <section className="mt-10 rule pt-8">
        <h2 className="display-sm">Lead times & dates</h2>
        <ul className="num mt-3 space-y-2 text-[1rem] text-ink-soft">
          <li>Most designs need <strong className="text-ink">2 days</strong> notice; intricate ones (fringe, ombre, loaded crowns) need <strong className="text-ink">3 days</strong>.</li>
          <li>Some simpler designs accept short notice at <strong className="text-ink">+15%</strong>.</li>
          <li>Dates are held for 30 minutes during checkout. Your date is only locked when payment lands.</li>
          <li>We take a limited number of cakes per day — that&rsquo;s why a date can show as full.</li>
        </ul>
      </section>

      <section className="mt-10 rule pt-8">
        <h2 className="display-sm">Delivery & pickup</h2>
        <ul className="mt-3 space-y-2 text-[1rem]">
          {zones.map(([name, fee]) => (
            <li key={name} className="flex justify-between gap-4">
              <span className="text-ink-soft">{name}</span>
              <span className="num font-medium whitespace-nowrap">{fee}</span>
            </li>
          ))}
          <li className="flex justify-between gap-4">
            <span className="text-ink-soft">Pickup from Krishna Nagar (address shared on confirmation)</span>
            <span className="num font-medium whitespace-nowrap">free</span>
          </li>
        </ul>
        <p className="mt-3 text-[0.92rem] text-ink-soft">Outside these areas? Send a custom request — we&rsquo;ll say honestly if we can make the distance.</p>
      </section>

      <section className="mt-10 rule pt-8">
        <h2 className="display-sm">Payment</h2>
        <div className="mt-3 space-y-3 text-[1rem] text-ink-soft leading-relaxed">
          <p>UPI — GPay, PhonePe, Paytm, any UPI app. The checkout opens your app with the <strong className="text-ink">exact amount locked</strong> to your order; nobody can edit it, which is why there&rsquo;s nothing to negotiate.</p>
          <p>Custom cakes: deposit (usually half) to confirm the date, balance before pickup or delivery.</p>
          <p>You always get a receipt and a private tracking link — no need to ask us &ldquo;is it done?&rdquo;</p>
        </div>
      </section>

      <section className="mt-10 rule pt-8">
        <h2 className="display-sm">Allergens, plainly</h2>
        <p className="mt-3 text-[1rem] text-ink-soft leading-relaxed">
          Our cakes contain wheat and milk; most flavours contain egg (eggless is available on everything for +₹50). We work with nuts, soya and gluten in the same kitchen, so we can&rsquo;t promise zero traces. If an allergy is severe, tell us in the brief and we&rsquo;ll be straight with you about what&rsquo;s safe.
        </p>
      </section>

      <div className="mt-10 flex gap-3">
        <Link href="/designs" className="btn btn-cocoa">Browse designs</Link>
        <Link href="/custom" className="btn btn-ghost">Custom cake</Link>
      </div>
    </div>
  );
}
