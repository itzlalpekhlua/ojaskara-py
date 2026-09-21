import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "../globals.css";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { LoadingScreen } from "@/components/LoadingScreen";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { DriftingDiamonds } from "@/components/DriftingDiamonds";
import { apiGet } from "@/lib/api";
import type { SiteSettings } from "@/lib/types";

const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
});

const brand = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800", "900"],
  variable: "--font-brand",
});

export const metadata: Metadata = {
  title: "Ojaskaraa Builders",
  description:
    "Ojaskaraa Builders — premium residential and commercial construction, architecture, and design in Bharatpur & Kathmandu, Nepal.",
  icons: { icon: "/logo-mark.png" },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await apiGet<SiteSettings>("/api/settings");

  return (
    <html lang="en" className={`${sans.variable} ${brand.variable}`} data-scroll-behavior="smooth">
      <body className="font-sans bg-ink-950 text-bone antialiased">
        <div className="grain-overlay" />
        <DriftingDiamonds />
        <LoadingScreen />
        <Navigation phone={settings?.phone} />
        <main>{children}</main>
        <Footer
          phone={settings?.phone}
          phoneSecondary={settings?.phoneSecondary}
          email={settings?.email}
          locationPrimaryName={settings?.locationPrimaryName}
          locationPrimaryLabel={settings?.locationPrimaryLabel}
          locationSecondaryName={settings?.locationSecondaryName}
          locationSecondaryLabel={settings?.locationSecondaryLabel}
          instagramUrl={settings?.instagramUrl}
          facebookUrl={settings?.facebookUrl}
          tiktokUrl={settings?.tiktokUrl}
          whatsappUrl={settings?.whatsappUrl}
        />
        <FloatingWhatsApp phone={settings?.phone} />
      </body>
    </html>
  );
}
