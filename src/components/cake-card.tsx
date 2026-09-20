import Image from "next/image";
import Link from "next/link";
import { formatINR } from "@/lib/money";
import type { Design } from "@/lib/catalog";

export function CakeCard({ design, priority = false, delay = 0 }: { design: Design; priority?: boolean; delay?: number }) {
  const hero = design.images[0];
  const from = Math.round((design.baseKgPaise * 0.6) / 5000) * 5000;
  return (
    <Link href={`/designs/${design.slug}`} className="cake-card rv group block" data-delay={delay}>
      <div className="relative overflow-hidden rounded-[22px] bg-vanilla-deep" style={{ aspectRatio: "4 / 5" }}>
        <Image
          src={hero.card}
          alt={`${design.name}, a custom cake by B38 Bake House Mathura`}
          fill
          sizes="(max-width: 640px) 46vw, (max-width: 1024px) 30vw, 23vw"
          className="cake-img object-cover"
          priority={priority}
        />
        <span
          className="cake-arrow absolute top-3 right-3 w-10 h-10 rounded-full bg-cream/95 text-ink flex items-center justify-center text-lg shadow-md"
          aria-hidden
        >
          ↗
        </span>
        {design.leadHours <= 48 && (
          <span className="absolute bottom-3 left-3 text-[0.72rem] font-bold uppercase tracking-[0.08em] bg-pistachio-tint/95 text-[#4C6B2F] px-2.5 py-1 rounded-full">
            2-day notice
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-2">
        <h3 className="cake-title display text-[1.18rem] leading-tight">
          {design.name}
        </h3>
        <p className="num text-[0.95rem] font-bold whitespace-nowrap">from {formatINR(from)}</p>
      </div>
      <p className="text-[0.85rem] text-ink-soft mt-0.5 leading-snug">{design.styleTags.slice(0, 2).join(" · ").replace(/-/g, " ")}</p>
    </Link>
  );
}
