import type { Metadata } from "next";
import { listDesigns, listFlavours } from "@/lib/catalog";
import { CustomBrief } from "@/components/custom-brief";

export const metadata: Metadata = { title: "Bespoke cake brief" };
export const dynamic = "force-dynamic";

const STYLE_LABELS: Record<string, string> = {
  floral: "Floral", chocolate: "Chocolate", drip: "Drip", rosette: "Rosettes",
  "vintage-piping": "Vintage piping", minimal: "Minimal", loaded: "Loaded", fruit: "Fruit", painted: "Painted",
};

export default function FromScratch() {
  const designs = listDesigns();
  const flavours = listFlavours();

  const styleGallery = Object.keys(STYLE_LABELS)
    .map(tag => {
      const d = designs.find(x => x.styleTags.includes(tag));
      return d ? { tag, label: STYLE_LABELS[tag], image: d.images[0].cardSm } : null;
    })
    .filter(Boolean) as { tag: string; label: string; image: string }[];

  return (
    <CustomBrief
      styleGallery={styleGallery}
      flavours={flavours.map(f => f.name)}
      city="Mathura"
    />
  );
}
