import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage, ContactBlock } from "@/components/LegalPage";
import { getSite } from "@/lib/content/get-site";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default async function Page() {
  const { site } = await getSite();
  return (
    <LegalPage title="Terms & Conditions">
      <p>
        These terms apply to your use of this website and to table requests made through it. By using the site you
        agree to them.
      </p>

      <h2>1. About us</h2>
      <p>
        This website is operated by {site.legal.entity}, {site.address.street}, {site.address.city},{" "}
        {site.address.state} {site.address.postalCode}.{site.legal.fssai && <> FSSAI Licence No. {site.legal.fssai}.</>}
      </p>

      <h2>2. Menu, prices and information</h2>
      <ul>
        <li>The menu on this site is indicative. Dishes, availability and prices may change without notice.</li>
        <li>Prices charged at the restaurant are final and include applicable taxes as shown on your bill.</li>
        <li>Photos are for illustration; actual presentation may vary.</li>
        <li>
          Our kitchen handles nuts, dairy, gluten, soy, egg, seafood and other allergens. We cannot guarantee any dish is
          allergen-free. Please inform staff of allergies before ordering.
        </li>
        <li>Vegetarian and non-vegetarian food is prepared in the same kitchen.</li>
      </ul>

      <h2>3. Table reservations</h2>
      <ul>
        <li>An online request is <strong>not confirmed</strong> until our staff call you to confirm.</li>
        <li>We may hold a confirmed table for 15 minutes past the booking time, after which it may be released.</li>
        <li>Please call us as early as possible if you need to cancel or change a booking.</li>
        <li>No payment or deposit is taken through this website.</li>
        <li>We may decline or cancel a request at our discretion, for example if we are fully booked.</li>
      </ul>

      <h2>4. Acceptable use</h2>
      <p>
        You agree not to submit false bookings, spam, or anything unlawful, and not to attempt to disrupt or gain
        unauthorised access to the site.
      </p>

      <h2>5. Intellectual property</h2>
      <p>
        The site&apos;s design, text, logo and photos belong to us or our licensors. You may not copy them for commercial
        use without permission.
      </p>

      <h2>6. Third-party links</h2>
      <p>
        Links to third-party sites such as Google Maps are provided for convenience. We are not responsible for their
        content or practices.
      </p>

      <h2>7. Liability</h2>
      <p>
        We try to keep the information on this site accurate but provide it &ldquo;as is&rdquo;. To the extent permitted by
        law, we are not liable for indirect or consequential loss arising from use of the website. Nothing in these
        terms limits your rights as a consumer under the Consumer Protection Act, 2019.
      </p>

      <h2>8. Privacy</h2>
      <p>See our <Link href="/privacy-policy">Privacy Policy</Link> and <Link href="/cookie-policy">Cookie Policy</Link>.</p>

      <h2>9. Governing law</h2>
      <p>
        These terms are governed by the laws of India. Courts at [Jayashankar Bhupalpally district / Hyderabad],
        Telangana have jurisdiction. {/* VERIFY with a lawyer */}
      </p>

      <h2>10. Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}
