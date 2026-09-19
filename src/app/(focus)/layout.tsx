import { SiteHeader } from "@/components/site-header";
import { getSettings } from "@/lib/settings";

// Focused task flows (the custom brief) render without the footer so the
// fixed step bar never collides with page furniture.
export default function FocusLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <>
      <SiteHeader whatsapp={s.whatsapp} />
      <main id="main">{children}</main>
    </>
  );
}
