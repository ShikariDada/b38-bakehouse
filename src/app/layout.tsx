import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "B38 Bake House — Custom cakes, made in Mathura",
    template: "%s · B38 Bake House",
  },
  description:
    "Design-led custom cakes made to order in Krishna Nagar, Mathura by Chhaya Savargaonkar. Choose from real designs we've already made, or bring your own reference.",
  openGraph: {
    title: "B38 Bake House — Custom cakes, made in Mathura",
    description: "Choose a design we've already made, or bring your own idea. Every cake is made after you order.",
    images: ["/media/hero/og-image.webp"],
    locale: "en_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9EE",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <body>{children}</body>
    </html>
  );
}
