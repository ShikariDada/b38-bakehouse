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
    title: `${d.name}, design no. ${String(d.number).padStart(2, "0")}`,
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

  const similar = listDesigns({ style: d.styleTags[0] }).filter(x => x.slug !== d.slug).slice(0, 4);
  const from = variants[0].pricePaise;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${d.name}, custom cake by B38 Bake House`,
    description: d.tagline,
    image: [d.images[0].full],
    brand: { "@type": "Brand", name: "B38 Bake House" },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: variants[0].pricePaise / 100,
      highPrice: variants[variants.length - 1].pricePaise / 100,
      availability: "https://schema.org/PreOrder",
      areaServed: s.city,
    },
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+1.5rem)] pb-28 lg:pb-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <nav aria-label="Breadcrumb" className="text-[0.87rem] text-ink-soft mb-5">
        <Link href="/designs" className="hover:text-strawberry-deep font-medium">Designs</Link>
        <span className="mx-1.5">/</span>
        <span className="num">No. {String(d.number).padStart(2, "0")}</span>
      </nav>

      <div className="grid lg:grid-cols-[55%_1fr] gap-8 lg:gap-12">
        <div className="rv-img rounded-[28px] overflow-hidden" style={{ aspectRatio: "5 / 6" }}>
          <div className="rv-img-inner h-full">
            <CakeGallery images={d.images} name={d.name} />
          </div>
        </div>

        <div>
          <header className="rv">
            <p className="eyebrow text-strawberry-deep">No. {String(d.number).padStart(2, "0")} · from {formatINR(from)}</p>
            <h1 className="display display-md mt-2">{d.name}</h1>
            <p className="mt-3 text-ink-soft lg:hidden">{d.tagline}</p>
            <p className="num mt-2 text-[0.88rem] text-ink-soft">
              {d.leadHours >= 72 ? "3 days" : "2 days"} notice · baked fresh in {s.city}
              {d.rushAllowed ? " · short notice possible" : ""}
            </p>
          </header>

          <div className="mt-6 lg:hidden text-ink-soft text-[0.97rem] leading-relaxed rv" data-delay="80">{d.story}</div>

          <div className="mt-9 lg:mt-7">
            <OrderConfigurator
              designSlug={d.slug}
              designName={d.name}
              leadHours={d.leadHours}
              rushAllowed={d.rushAllowed}
              variants={variants}
              flavours={flavours.map(f => ({ id: f.id, name: f.name, adjustmentPaise: f.adjustment_paise }))}
              addons={addons.map(a => ({ id: a.id, name: a.name, description: a.description, pricePaise: a.price_paise }))}
              dates={dates}
              initialQuote={initial.ok ? initial.quote : { totalPaise: 0, lines: [], deliveryPaise: 0 }}
              zonesHint={s.city}
            />
          </div>

          <section className="rv mt-10 hidden lg:block border-t border-line pt-6" data-delay="120">
            <h2 className="eyebrow text-strawberry-deep">Inside the design</h2>
            <p className="mt-2 text-ink-soft text-[0.97rem] leading-relaxed">{d.story}</p>
            <p className="mt-3 text-[0.85rem] text-ink-soft">
              Contains wheat and milk. Most flavours contain egg, eggless is +{formatINR(5000)}. Made in a home kitchen that also handles nuts.
            </p>
          </section>
        </div>
      </div>

      {similar.length > 0 && (
        <section className="mt-20">
          <h2 className="display-sm">You might also eat</h2>
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
            {similar.map(x => <CakeCard key={x.slug} design={x} delay={0} />)}
          </div>
        </section>
      )}
    </div>
  );
}
