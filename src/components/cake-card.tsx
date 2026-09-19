import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/money";
import type { Design } from "@/lib/catalog";

export function CakeCard({ design, priority = false }: { design: Design; priority?: boolean }) {
  const hero = design.images[0];
  const from = Math.round((design.baseKgPaise * 0.6) / 5000) * 5000;
  return (
    <Link href={`/designs/${design.slug}`} className="cake-card group block">
      <div className="relative overflow-hidden rounded-[4px] bg-cream-200" style={{ aspectRatio: "4 / 5" }}>
        <Image
          src={hero.card}
          alt={`${design.name} — a custom cake by B38 Bake House, Mathura`}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 22vw"
          className="object-cover"
          priority={priority}
        />
      </div>
      <div className="mt-2.5 flex items-baseline justify-between gap-2">
        <h3 className="cake-card-name display text-[1.12rem] leading-tight">
          <span className="text-cocoa-600 num text-[0.8em] mr-1.5">{String(design.number).padStart(2, "0")}</span>
          {design.name}
        </h3>
        <p className="num text-[0.92rem] text-ink-soft whitespace-nowrap">from {formatINR(from)}</p>
      </div>
    </Link>
  );
}
