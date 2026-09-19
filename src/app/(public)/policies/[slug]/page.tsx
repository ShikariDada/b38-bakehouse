import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

const POLICIES: Record<string, { title: string; body: (s: ReturnType<typeof getSettings>) => React.ReactNode }> = {
  terms: {
    title: "Terms",
    body: s => (
      <>
        <p>B38 Bake House (&ldquo;we&rdquo;, run by {s.ownerName}) takes cake orders through this website for {s.city} and nearby areas. By placing an order you confirm the details shown in your order summary are correct.</p>
        <p>Prices are in Indian Rupees and include what the page shows. A date is confirmed only after payment succeeds; unpaid holds lapse after 30 minutes.</p>
        <p>We may photograph completed cakes for our archive; tell us in the order notes if you&rsquo;d rather we didn&rsquo;t share yours, and we won&rsquo;t.</p>
      </>
    ),
  },
  privacy: {
    title: "Privacy",
    body: s => (
      <>
        <p>We collect what an order needs: your name, phone number, optional email, delivery address if applicable, and your cake details. Reference photos you upload for custom work are private — they are never published without asking you first.</p>
        <p>We don&rsquo;t run ads or sell data. Order records are kept for accounting; references are cleaned up periodically. Want your data deleted? Message {s.phoneDisplay} with your order number.</p>
      </>
    ),
  },
  refunds: {
    title: "Refunds & cancellations",
    body: () => (
      <>
        <p>Cakes are made fresh for a specific day, so timing matters:</p>
        <ul className="list-disc pl-5 space-y-1.5">
          <li>Cancel 48+ hours before your date: full refund.</li>
          <li>Cancel under 48 hours: 50% refund (ingredients and the day&rsquo;s slot are already committed).</li>
          <li>Under 24 hours or after production starts: the cake is yours to pick up; no refund.</li>
          <li>If we cancel (illness, emergency), you get a full refund, always.</li>
        </ul>
        <p>Something wrong with the cake you received? Tell us the same day with a photo and we&rsquo;ll make it right — remake or refund, our call together.</p>
      </>
    ),
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = POLICIES[slug];
  return { title: p ? p.title : "Policies" };
}

export default async function PolicyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = POLICIES[slug];
  if (!p) notFound();
  const s = getSettings();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)] pb-16">
      <h1 className="display display-lg">{p.title}</h1>
      <div className="mt-8 space-y-4 text-[1rem] leading-relaxed text-ink-soft max-w-prose">
        {p.body(s)}
      </div>
      <p className="num mt-10 text-[0.85rem] text-ink-soft">Last updated 20 September 2026 · {s.businessName}, {s.city}</p>
    </div>
  );
}
