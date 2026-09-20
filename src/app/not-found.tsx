import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative mx-auto max-w-md px-4 pt-[calc(var(--header-h)+4rem)] text-center pb-24">
      <div className="absolute top-[calc(var(--header-h)+1rem)] left-1/2 -translate-x-1/2 w-72 h-72 rounded-full bg-strawberry-tint blur-3xl opacity-70 pointer-events-none" aria-hidden />
      <div className="relative rv" data-delay="0">
        <p className="eyebrow text-strawberry-deep justify-center">404</p>
        <h1 className="display display-md mt-3">This one&rsquo;s not in the oven.</h1>
        <p className="hand mt-4">we checked the fridge too</p>
        <p className="mt-3 text-ink-soft">The page you&rsquo;re after doesn&rsquo;t exist, but plenty of cakes do.</p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Link href="/designs" className="btn btn-primary">Browse designs</Link>
          <Link href="/" className="btn btn-ghost">Home</Link>
        </div>
      </div>
    </div>
  );
}
