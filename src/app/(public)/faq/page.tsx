import Link from "next/link";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Short answers: notice periods, eggless options, delivery, payment and custom work at B38 Bake House.",
};

export const dynamic = "force-dynamic";

function QA({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <div className="border-t border-line pt-5">
      <h2 className="display display-sm">{q}</h2>
      <div className="mt-2.5 text-ink-soft leading-relaxed max-w-prose">{children}</div>
    </div>
  );
}

export default function FAQ() {
  const s = getSettings();
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-20">
      <header className="rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep">FAQ</p>
        <h1 className="display display-lg mt-3">Asked, answered</h1>
      </header>

      <div className="mt-10 space-y-7 rv" data-delay="100">
        <QA q="How much notice do you need?">
          <p>Two days for most designs, three for the intricate ones: the exact notice for each design is on its page. Dates close as they fill; if your date shows available at checkout, it&rsquo;s genuinely free.</p>
        </QA>
        <QA q="Is eggless possible?">
          <p>Yes: every design, every flavour, +₹50. We mark it clearly and keep separate handling for eggless orders.</p>
        </QA>
        <QA q="Can you make this exact Pinterest cake?">
          <p>Almost certainly something close to it. Send it through <Link href="/custom" className="underline underline-offset-2 hover:text-strawberry-deep">a custom brief</Link> and we&rsquo;ll tell you what we&rsquo;d keep and what we&rsquo;d change, then quote a fixed price.</p>
        </QA>
        <QA q="Why can&rsquo;t I bargain?">
          <p>Because the price you see is the honest cost of making it well, by hand, from scratch. What we can do is help you pick a design and size that fits your budget: the catalogue goes down to ₹650 for a reason.</p>
        </QA>
        <QA q="Do you deliver?">
          <p>Across Mathura city and Vrindavan, with fixed fees shown at checkout. Pickup from Krishna Nagar is free and always an option.</p>
        </QA>
        <QA q="How do I pay?">
          <p>UPI. The checkout opens your UPI app with the exact amount locked. No typing amounts, no screenshots, automatic confirmation.</p>
        </QA>
        <QA q="Where do you source ingredients?">
          <p>Local suppliers in Mathura for dairy and produce; branded baking chocolate, vanilla and flour. If a design uses a specific brand, it&rsquo;s named in its description.</p>
        </QA>
        <QA q="Can I get it faster?">
          <p>Sometimes. Simpler designs accept short notice at +15%, and the date picker will say &ldquo;rush&rdquo; on days that allow it. We won&rsquo;t compromise a cake just to hit a clock.</p>
        </QA>
      </div>

      <div className="mt-12 rv rounded-[24px] bg-strawberry-tint border border-strawberry/20 p-6 sm:p-7" data-delay="0">
        <p className="text-[0.98rem] text-ink max-w-md">Anything else? Message us on WhatsApp. A person replies, usually within the hour.</p>
        <a className="btn btn-primary mt-4" href={`https://wa.me/${s.whatsapp}`} target="_blank" rel="noopener">WhatsApp us</a>
      </div>
    </div>
  );
}
