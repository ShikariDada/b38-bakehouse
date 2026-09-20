import Link from "next/link";
import type { Metadata } from "next";
import { listDesigns } from "@/lib/catalog";
import { CakeCard } from "@/components/cake-card";

export const metadata: Metadata = { title: "Pick a design to customise" };
export const dynamic = "force-dynamic";

export default function PickDesignToCustomise() {
  const designs = listDesigns();
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-[calc(var(--header-h)+2rem)]">
      <p className="eyebrow text-cocoa-600">Customise</p>
      <h1 className="display display-lg mt-2">Pick your starting point</h1>
      <p className="mt-3 max-w-lg text-ink-soft">
        Choose the cake closest to what you have in mind. The brief will carry it along, and we&rsquo;ll quote the changes before anything is confirmed.
      </p>
      <div className="mt-9 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-7 sm:gap-x-5">
        {designs.map(d => <CakeCard key={d.slug} design={d} />)}
      </div>
      <p className="mt-10 text-[0.95rem]">
        Nothing close? <Link href="/custom/from-scratch" className="underline underline-offset-4">Start from a blank page instead →</Link>
      </p>
    </div>
  );
}
