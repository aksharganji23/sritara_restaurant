import Link from "next/link";
import { legalLinks, navLinks, type SiteInfo } from "@/lib/site";
import { BrandLogo } from "./BrandLogo";

export function Footer({ site }: { site: SiteInfo }) {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/60 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
                    <BrandLogo name={site.name} size="md" />
          <p className="mt-4 font-display text-xl text-cream">{site.fullName}</p>
          {site.teluguName && <p lang="te" className="mt-2 text-muted">{site.teluguName}</p>}
          <address className="mt-6 not-italic leading-relaxed text-muted">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.postalCode}
            <br />
            <a className="mt-2 inline-block text-gold underline underline-offset-4" href={`tel:${site.phoneE164}`}>
              {site.phoneDisplay}
            </a>
            {site.whatsappLink && (
              <>
                {" · "}
                <a className="text-gold underline underline-offset-4" href={site.whatsappLink} target="_blank" rel="noopener noreferrer">
                  WhatsApp<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </>
            )}
            {site.email && (
              <>
                <br />
                <a className="text-gold underline underline-offset-4" href={`mailto:${site.email}`}>{site.email}</a>
              </>
            )}
          </address>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cream">Explore</h2>
          <ul className="mt-4 space-y-2">
            {navLinks.map((l) => (
              <li key={l.href}>
                <Link className="text-muted hover:text-gold" href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Legal">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-cream">Legal</h2>
          <ul className="mt-4 space-y-2">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link className="text-muted hover:text-gold" href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="border-t border-line/60">
        <p className="mx-auto max-w-7xl px-5 py-6 text-sm text-muted sm:px-8">
          © {year} {site.legal.entity}. All rights reserved.
          {site.legal.fssai && <> FSSAI Lic. No. {site.legal.fssai}.</>}
          {site.legal.gstin && <> GSTIN {site.legal.gstin}.</>}
        </p>
      </div>
    </footer>
  );
}
