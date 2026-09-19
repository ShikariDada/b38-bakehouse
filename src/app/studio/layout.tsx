import Link from "next/link";
import { redirect } from "next/navigation";
import { isStudioAuthed } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { StudioLogout } from "@/components/studio-chrome";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/studio", label: "Today" },
  { href: "/studio/orders", label: "Orders" },
  { href: "/studio/requests", label: "Requests" },
  { href: "/studio/designs", label: "Designs" },
  { href: "/studio/capacity", label: "Capacity" },
  { href: "/studio/settings", label: "Settings" },
];

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  if (!(await isStudioAuthed())) {
    if (process.env.NEXT_PUBLIC_NO_STUDIO_LOCK === "1") return <div className="studio-body min-h-screen">{children}</div>;
    redirect("/studio/login");
  }

  return (
    <div className="studio-body min-h-screen">
      <header className="border-b border-line bg-cream-50 sticky top-0 z-40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-14 flex items-center gap-4">
          <Link href="/studio" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="display text-[1.05rem]">Studio</span>
          </Link>
          <nav className="flex gap-4 overflow-x-auto text-[0.9rem] flex-1" aria-label="Studio">
            {NAV.map(n => (
              <Link key={n.href} href={n.href} className="whitespace-nowrap hover:text-cocoa-700">{n.label}</Link>
            ))}
          </nav>
          <StudioLogout />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-8">{children}</main>
    </div>
  );
}
