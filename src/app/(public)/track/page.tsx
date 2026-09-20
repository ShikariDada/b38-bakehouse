import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackEntry() {
  return (
    <div className="mx-auto max-w-md px-4 pt-[calc(var(--header-h)+3rem)] pb-24">
      <div className="rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep">Order tracking</p>
        <h1 className="display display-md mt-3">Where&rsquo;s my cake?</h1>
      </div>
      <p className="mt-4 text-ink-soft leading-relaxed rv" data-delay="80">
        Every order and quote gets a private tracking link when it&rsquo;s created: check your confirmation message. Lost it? Message us on WhatsApp with your order number and we&rsquo;ll resend it.
      </p>
      <div className="mt-8 rounded-[24px] bg-strawberry-tint border border-strawberry/20 p-6 rv" data-delay="160">
        <p className="text-[0.95rem] text-ink">Have your order number handy and we&rsquo;ll resend the link right away.</p>
        <a
          href="https://wa.me/919368565911?text=Hi%20B38%2C%20I%20lost%20my%20tracking%20link."
          className="btn btn-primary mt-4"
          target="_blank" rel="noopener"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}
