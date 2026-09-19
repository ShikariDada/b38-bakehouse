"use client";

import Image from "next/image";
import { useState } from "react";

export function CakeGallery({ images, name }: { images: { full: string; fullAvif?: string | null; card: string }[]; name: string }) {
  const [idx, setIdx] = useState(0);

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    const slide = el.scrollWidth / images.length;
    setIdx(Math.min(images.length - 1, Math.round(el.scrollLeft / slide)));
  }

  return (
    <div>
      <div className="gallery-rail flex overflow-x-auto rounded-[4px] bg-cream-200" onScroll={onScroll} style={{ aspectRatio: "5 / 6" }}>
        {images.map((im, i) => (
          <div key={im.full} className="relative shrink-0 w-full" style={{ aspectRatio: "5 / 6" }}>
            <Image
              src={im.full}
              alt={`${name} — B38 original, view ${i + 1} of ${images.length}`}
              fill
              priority={i === 0}
              sizes="(max-width: 1024px) 100vw, 55vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {images.length > 1 && (
        <div className="mt-2 flex items-center justify-between">
          <p className="num text-[0.82rem] text-ink-soft" aria-live="polite">{idx + 1} / {images.length}</p>
          <div className="flex gap-1.5" aria-hidden>
            {images.map((_, i) => (
              <span key={i} className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: i === idx ? "var(--color-cocoa-700)" : "var(--color-line)" }} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
