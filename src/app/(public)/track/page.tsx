import type { Metadata } from "next";

export const metadata: Metadata = { title: "Track your order" };

export default function TrackEntry() {
  return (
    <div className="mx-auto max-w-md px-4 pt-[calc(var(--header-h)+3rem)] pb-24">
      <p className="eyebrow text-cocoa-600">Order tracking</p>
      <h1 className="display display-md mt-2">Where&rsquo;s my cake?</h1>
      <p className="mt-3 text-ink-soft">
        Every order and quote gets a private tracking link when it&rsquo;s created — check your confirmation message. Lost it? Message us on WhatsApp with your order number and we&rsquo;ll resend it.
      </p>
      <a
        href="https://wa.me/919368565911?text=Hi%20B38%2C%20I%20lost%20my%20tracking%20link."
        className="btn btn-cocoa mt-6"
        target="_blank" rel="noopener"
      >
        Ask on WhatsApp
      </a>
    </div>
  );
}
