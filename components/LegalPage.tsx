import { getSite } from "@/lib/content/get-site";
import { LEGAL_LAST_UPDATED } from "@/lib/site";

export function LegalPage({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-3xl px-5 pb-24 pt-36 sm:px-8">
      <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Legal</p>
      <h1 className="mt-3 font-display text-4xl text-cream sm:text-5xl">{title}</h1>
      <p className="mt-3 text-muted">Last updated: {LEGAL_LAST_UPDATED}</p>
      <div className="prose-legal mt-10">{children}</div>
    </article>
  );
}

/** Contact details for legal pages, always matching what's set in the admin. */
export async function ContactBlock() {
  const { site } = await getSite();
  return (
    <p>
      <strong>{site.legal.entity}</strong>
      <br />
      {site.address.street}, {site.address.city}, {site.address.state} {site.address.postalCode}
      <br />
      Phone: <a href={`tel:${site.phoneE164}`}>{site.phoneDisplay}</a>
      {site.email && (
        <>
          {" · "}Email: <a href={`mailto:${site.email}`}>{site.email}</a>
        </>
      )}
      {site.legal.grievanceOfficer && (
        <>
          <br />
          Grievance Officer: {site.legal.grievanceOfficer}
        </>
      )}
    </p>
  );
}
