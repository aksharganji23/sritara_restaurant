import type { Metadata } from "next";
import { LegalPage, ContactBlock } from "@/components/LegalPage";

export const metadata: Metadata = { title: "Refund Policy", alternates: { canonical: "/refund-policy" } };

export default function Page() {
  return (
    <LegalPage title="Refund & Cancellation Policy">
      <h2>1. Online payments</h2>
      <p>
        This website does not take any payments, deposits or pre-orders. All payments are made at the restaurant.
      </p>

      <h2>2. Table reservations</h2>
      <p>
        Reservations are free. You can cancel or change a booking at any time by calling us — there is no cancellation
        fee.
      </p>

      <h2>3. Dine-in and takeaway orders</h2>
      <ul>
        <li>
          If a dish is not as described, is incorrect, or has a quality problem, please tell our staff
          <strong> before you finish it or leave the restaurant</strong>. We will replace the dish or remove it from your bill.
        </li>
        <li>
          For takeaway, please check your order at the counter. If something is missing or wrong, contact us within
          2 hours of collection with your bill and we will replace the item or refund that item.
        </li>
        <li>Food that has been fully consumed, or problems reported after the time above, may not be eligible.</li>
      </ul>

      <h2>4. How refunds are paid</h2>
      <p>
        Approved refunds are made using the original payment method (cash, card or UPI). Card/UPI refunds are initiated
        within 2 working days; your bank may take 5–7 working days to credit them.
      </p>

      <h2>5. Third-party delivery apps</h2>
      <p>
        Orders placed through apps such as Swiggy or Zomato are covered by that app&apos;s refund policy. Please raise
        issues through the app. {/* VERIFY — remove if not listed on delivery apps */}
      </p>

      <h2>6. Your rights</h2>
      <p>This policy does not limit your rights under the Consumer Protection Act, 2019.</p>

      <h2>7. Contact</h2>
      <ContactBlock />
    </LegalPage>
  );
}
