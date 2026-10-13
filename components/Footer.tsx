import Link from "next/link";
import { legalLinks, navLinks, site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-line/60 bg-surface">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 text-gold">
            <Logo className="size-10" />
            <p className="font-display text-2xl text-cream">{site.fullName}</p>
          </div>
          <p lang="te" className="mt-2 text-muted">{site.teluguName}</p>
          <address className="mt-6 not-italic leading-relaxed text-muted">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.state} {site.address.postalCode}
            <br />
            <a className="mt-2 inline-block text-gold underline underline-offset-4" href={`tel:${site.phoneE164}`}>
              {site.phoneDisplay}
            </a>
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
          © {year} {site.legal.entity}. All rights reserved. FSSAI Lic. No. {site.legal.fssai}
        </p>
      </div>
    </footer>
  );
}
