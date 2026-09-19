import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDesign, listFlavours } from "@/lib/catalog";
import { formatINR } from "@/lib/money";
import { CustomBrief } from "@/components/custom-brief";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDesign(slug);
  return { title: d ? `Customise ${d.name}` : "Customise a design" };
}

export default async function FromDesign({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDesign(slug);
  if (!d || !d.active) notFound();
  const flavours = listFlavours();

  return (
    <CustomBrief
      startDesign={{
        slug: d.slug,
        name: d.name,
        number: d.number,
        image: d.images[0].cardSm,
        fromPrice: `from ${formatINR(Math.round(d.baseKgPaise * 0.6 / 5000) * 5000)}`,
      }}
      styleGallery={[{ tag: d.styleTags[0], label: d.name, image: d.images[0].cardSm }]}
      flavours={flavours.map(f => f.name)}
      city="Mathura"
    />
  );
}
