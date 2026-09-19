import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDesign, listDesigns, listFlavours, listAddons, variantPrices } from "@/lib/catalog";
import { availableDates } from "@/lib/capacity";
import { formatINR } from "@/lib/money";
import { computeQuote, earliestDate } from "@/lib/pricing";
import { getSettings } from "@/lib/settings";
import { CakeGallery } from "@/components/cake-gallery";
import { OrderConfigurator } from "@/components/order-configurator";
import { CakeCard } from "@/components/cake-card";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDesign(slug);
  if (!d) return { title: "Design not found" };
  return {
    title: `${d.name} — design No. ${String(d.number).padStart(2, "0")}`,
    description: d.tagline,
    openGraph: { images: [d.images[0].card], title: `${d.name} · B38 Bake House` },
  };
}

export default async function DesignPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDesign(slug);
  if (!d || !d.active) notFound();

  const flavours = listFlavours();
  const addons = listAddons();
  const s = getSettings();
  const { available } = availableDates(d.leadHours, d.capacityPoints, 21);
  const dates = available.map(a => ({
    date: a.date,
    state: (a.blocked || a.remainingPoints < d.capacityPoints ? "full" : "available") as "full" | "available",
  }));

  const variants = variantPrices(d.baseKgPaise);
  const initial = computeQuote({
    designSlug: d.slug,
    variantId: variants[1]?.id ?? variants[0].id,
    flavourId: flavours[0].id,
    eggless: false,
    message: "",
    addons: [],
    fulfilment: "pickup",
    eventDate: earliestDate(d.leadHours),
  });

  const similar = listDesigns({ style: d.styleTags[0] })
    .filter(x => x.slug !== d.slug)
    .slice(0, 4);
  const city = s.city;

  // Product structured data — only truthful fields
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${d.name} — custom cake by B38 Bake House`,
    description: d.tagline,
    image: [d.images[0].full],
    brand: { "@type": "Brand", name: "B38 Bake House" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: variants[0].pricePaise / 100,
      highPrice: variants[variants.length - 1].pricePaise / 100,
      availability: "https://schema.org/PreOrder",
      areaServed: city,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+1.5rem)] pb-28 lg:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-[0.85rem] text-ink-soft mb-5">
        <Link href="/designs" className="hover:text-cocoa-700 underline-offset-2 hover:underline">Designs</Link>
        <span className="mx-1.5">/</span>
        <span className="num">No. {String(d.number).padStart(2, "0")}</span>
      </nav>

      <div className="grid lg:grid-cols-[55%_1fr] gap-8 lg:gap-12">
        <div>
          <CakeGallery images={d.images} name={d.name} />
          <div className="mt-5 hidden lg:block">
            <p className="eyebrow text-cocoa-600">Inside the design</p>
            <p className="mt-2 text-ink-soft text-[0.97rem] leading-relaxed">{d.story}</p>
            <dl className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-[0.88rem]">
              <div><dt className="text-ink-soft inline">Style: </dt><dd className="inline">{d.styleTags.join(", ")}</dd></div>
              <div><dt className="text-ink-soft inline">Best for: </dt><dd className="inline">{d.occasionTags.join(", ").replace(/-/g, " ")}</dd></div>
            </dl>
            <p className="mt-4 text-[0.85rem] text-ink-soft">
              Contains wheat, milk; most flavours contain egg (eggless available). Made in a home kitchen that also handles nuts.
            </p>
          </div>
        </div>

        <div>
          <header>
            <p className="num text-cocoa-600 text-[0.9rem]">No. {String(d.number).padStart(2, "0")} · from {formatINR(Math.round(d.baseKgPaise * 0.6 / 5000) * 5000)}</p>
            <h1 className="display display-md mt-1">{d.name}</h1>
            <p className="mt-3 text-ink-soft lg:hidden">{d.tagline}</p>
            <p className="num mt-2 text-[0.88rem] text-ink-soft">
              {d.leadHours >= 72 ? "3 days" : "2 days"} notice · made fresh in {city}
              {d.rushAllowed ? " · short-notice possible" : ""}
            </p>
          </header>

          <div className="mt-8 lg:hidden">
            <p className="text-ink-soft text-[0.97rem] leading-relaxed">{d.story}</p>
          </div>

          <div className="mt-9 lg:mt-6">
            <OrderConfigurator
              designSlug={d.slug}
              designName={d.name}
              leadHours={d.leadHours}
              rushAllowed={d.rushAllowed}
              variants={variants}
              flavours={flavours.map(f => ({ id: f.id, name: f.name, adjustmentPaise: f.adjustment_paise }))}
              addons={addons.map(a => ({ id: a.id, name: a.name, description: a.description, pricePaise: a.price_paise }))}
              dates={dates}
              initialQuote={
                initial.ok
                  ? initial.quote
                  : { totalPaise: 0, lines: [], deliveryPaise: 0 }
              }
              zonesHint={city}
            />
          </div>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="display-sm">Similar from the archive</h2>
          <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5">
            {similar.map(x => <CakeCard key={x.slug} design={x} />)}
          </div>
        </section>
      )}
    </div>
  );
}
