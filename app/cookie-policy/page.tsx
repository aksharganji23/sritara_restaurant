import type { Metadata } from "next";
import { LegalPage, ContactBlock } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Cookie Policy", alternates: { canonical: "/cookie-policy" } };

export default function Page() {
  return (
    <LegalPage title="Cookie Policy">
      <p>
        Cookies are small files a website stores on your device. This page lists every cookie and similar technology
        this site uses.
      </p>

      <h2>1. Cookies we set</h2>
      <p>
        <strong>None.</strong> This website does not set any cookies, and does not use analytics, advertising pixels,
        fingerprinting or local storage to track you. That is why you don&apos;t see a cookie banner.
      </p>

      <h2>2. Third-party content you can choose to load</h2>
      <table>
        <thead><tr><th>Provider</th><th>When</th><th>What happens</th></tr></thead>
        <tbody>
          <tr>
            <td>Google Maps</td>
            <td>Only after you click &ldquo;Load Google Map&rdquo;</td>
            <td>
              Google receives your IP address and may set cookies (for example <code>NID</code>, <code>AEC</code>) on
              google.com. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google&apos;s Privacy Policy</a>.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Your choice to load the map lasts only until you leave or refresh the page — we don&apos;t remember it.
      </p>
      <p>
        Links to Google Maps reviews or directions open Google&apos;s own website, which has its own cookie rules.
      </p>

      <h2>3. Managing cookies</h2>
      <p>
        You can block or delete cookies in your browser settings. Blocking Google&apos;s cookies won&apos;t affect how
        this site works, though the embedded map may not load.
      </p>

      <h2>4. Changes</h2>
      <p>
        If we ever add analytics or other non-essential cookies, we will update this page and ask for your consent
        before setting them.
      </p>

      <h2>5. Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}
