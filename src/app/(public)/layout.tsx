import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Motion } from "@/components/motion";
import { getSettings } from "@/lib/settings";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <>
      <Motion />
      <SiteHeader whatsapp={s.whatsapp} />
      <main id="main">{children}</main>
      <SiteFooter
        businessName={s.businessName}
        ownerName={s.ownerName}
        phoneDisplay={s.phoneDisplay}
        whatsapp={s.whatsapp}
        instagram={s.instagram}
        address={s.address}
        mapsLink={s.mapsLink}
        city={s.city}
      />
    </>
  );
}
