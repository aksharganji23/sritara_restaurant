import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getSite } from "@/lib/content/get-site";

// Content comes from the database (cached, refreshed instantly when the admin saves).
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { site } = await getSite();
  return {
    title: { default: `${site.fullName} | ${site.address.city}`, template: `%s | ${site.name}` },
    description: `${site.tagline}. ${site.services.join(", ")}${site.priceRange ? `, ${site.priceRange}` : ""}.`,
    alternates: { canonical: "/" },
    openGraph: { type: "website", locale: "en_IN", siteName: site.fullName, title: site.fullName, description: site.tagline },
    robots: { index: true, follow: true },
  };
}

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const { site } = await getSite();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: site.fullName,
    alternateName: site.teluguName || undefined,
    url: site.url,
    telephone: site.phoneE164,
    priceRange: site.priceRange || undefined,
    servesCuisine: ["Telangana", "North Indian", "Indo-Chinese"],
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.street,
      addressLocality: site.address.city,
      addressRegion: site.address.state,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: site.hoursWeek
      .map((d, i) => (d.closed ? null : { "@type": "OpeningHoursSpecification", dayOfWeek: DAY_NAMES[i], opens: d.open, closes: d.close }))
      .filter(Boolean),
  };

  return (
    <div className="grain">
      <Header name={site.name} phoneDisplay={site.phoneDisplay} phoneE164={site.phoneE164} announcement={site.announcement} />
      <main id="main" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer site={site} />
      <script
        type="application/ld+json"
        // Built on the server from validated settings; "<" is escaped so it can't close the tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </div>
  );
}
