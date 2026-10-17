import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, ContactBlock } from "@/components/LegalPage";
import { activeChannels } from "@/lib/notify";
import { getSite } from "@/lib/content/get-site";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default async function Page() {
  const { site, settings } = await getSite();
  const channels = activeChannels(settings.alerts);
  return (
    <LegalPage title="Privacy Policy">
      <p>
        {site.legal.entity} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) respects your privacy. This policy explains what personal data
        this website collects, why, and your rights under India&apos;s Digital Personal Data Protection Act, 2023
        (&ldquo;DPDP Act&rdquo;) and the Information Technology Act, 2000.
      </p>

      <h2>1. The short version</h2>
      <ul>
        <li>You can browse this site without giving us any personal data.</li>
        <li>We collect your name and mobile number only if you request a table — and only to confirm that booking.</li>
        <li>We use no analytics, advertising or tracking cookies.</li>
        <li>We never sell your data.</li>
      </ul>

      <h2>2. What we collect and why</h2>
      <table>
        <thead><tr><th>Data</th><th>Purpose</th><th>Kept for</th></tr></thead>
        <tbody>
          <tr><td>Name, mobile number, booking date/time, party size, optional notes</td><td>To receive, confirm and manage your table request</td><td>Stored in our booking system and deleted automatically 30 days after your booking date</td></tr>
          <tr><td>IP address (transient)</td><td>To block automated spam on the booking form</td><td>Held in server memory only; not stored or logged</td></tr>
          <tr><td>Standard server logs kept by our hosting provider</td><td>Security and reliability of the website</td><td>As per the host&apos;s retention (typically ≤ 30 days)</td></tr>
        </tbody>
      </table>
      <p>
        Please don&apos;t include health or other sensitive information in the booking notes. If you have an allergy,
        tell our staff in person when ordering.
      </p>

      <h2>3. Legal basis</h2>
      <p>
        We process booking data on the basis of your consent, given when you tick the consent box on the booking form.
        You can withdraw consent at any time by contacting us; this will cancel any pending request.
      </p>

      <h2>4. Who we share it with</h2>
      <ul>
        <li><strong>Hosting provider</strong> — Render Services, Inc. hosts the website.</li>
        <li><strong>Database provider</strong> — Neon, Inc. stores booking requests and website content.</li>
        <li>
          <strong>Booking notification service</strong> — your booking details are sent to our staff&apos;s phone
          using{" "}
          {channels.length ? channels.join(" and ") : "a messaging service"}, so we can call you to confirm.
        </li>
        <li><strong>Google</strong> — only if you choose to load the map. See our <Link href="/cookie-policy">Cookie Policy</Link>.</li>
        <li>Authorities, where required by law.</li>
      </ul>
      <p>Some providers may process data outside India. Where they do, we rely on transfers permitted under the DPDP Act.</p>

      <h2>5. Your rights</h2>
      <p>Under the DPDP Act you may ask us to:</p>
      <ul>
        <li>tell you what personal data we hold about you and how it is used;</li>
        <li>correct, complete, update or erase it;</li>
        <li>withdraw your consent;</li>
        <li>nominate another person to exercise these rights on your behalf; and</li>
        <li>resolve a grievance. We will respond within the time limits set by law.</li>
      </ul>
      <p>
        If you are not satisfied with our response, you may complain to the Data Protection Board of India.
      </p>

      <h2>6. Children</h2>
      <p>
        This site is not directed at children. Bookings should be made by an adult (18+). We do not knowingly collect
        data from children.
      </p>

      <h2>7. Security</h2>
      <p>
        The site is served only over HTTPS with strict security headers. Booking requests are stored in an encrypted
        database that only our staff can access through a password-protected admin area, and are deleted automatically
        30 days after the booking date. No method of transmission is 100% secure, but we take reasonable safeguards.
      </p>

      <h2>8. Changes</h2>
      <p>We may update this policy. The &ldquo;last updated&rdquo; date above shows the latest version.</p>

      <h2>9. Contact &amp; Grievance Officer</h2>
      <ContactBlock />
    </LegalPage>
  );
}
