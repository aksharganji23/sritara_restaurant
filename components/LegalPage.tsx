import { site } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-36 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Legal</p>
      <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">{title}</h1>
      <p className="mt-3 text-muted">Last updated: {site.legal.lastUpdated}</p>
      <div className="prose-legal mt-10">{children}</div>
    </article>
  );
}

export function ContactBlock() {
  return (
    <p>
      <strong>{site.legal.entity}</strong>
      <br />
      {site.address.street}, {site.address.city}, {site.address.state} {site.address.postalCode}
      <br />
      Phone: <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a> · Email:{" "}
      <a href={`mailto:${site.email}`}>{site.email}</a>
      <br />
      Grievance Officer: {site.legal.grievanceOfficer}
    </p>
  );
}
