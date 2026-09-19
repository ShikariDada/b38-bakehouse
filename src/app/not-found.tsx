import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 pt-[calc(var(--header-h)+4rem)] text-center pb-24">
      <p className="eyebrow text-cocoa-600">404</p>
      <h1 className="display display-md mt-2">This one&rsquo;s not in the oven</h1>
      <p className="mt-3 text-ink-soft">The page you&rsquo;re after doesn&rsquo;t exist — but plenty of cakes do.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/designs" className="btn btn-cocoa">Browse designs</Link>
        <Link href="/" className="btn btn-ghost">Home</Link>
      </div>
    </div>
  );
}
