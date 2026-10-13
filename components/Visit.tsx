import { Clock, MapPin, Phone, Utensils } from "lucide-react";
import { site } from "@/lib/site";
import { Reveal } from "./Reveal";
import { OpenStatus } from "./OpenStatus";
import { ConsentMap } from "./ConsentMap";

export function Visit() {
  return (
    <section id="visit" aria-labelledby="visit-title" className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <Reveal>
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-gold">Visit us</p>
          <h2 id="visit-title" className="mt-3 font-display text-4xl text-cream sm:text-5xl">Find your seat</h2>
          <div className="mt-4"><OpenStatus /></div>

          <ul className="mt-10 space-y-7">
            <li className="flex gap-4">
              <MapPin aria-hidden="true" className="mt-1 size-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-bold text-cream">Address</h3>
                <address className="not-italic text-muted">
                  {site.address.street}, {site.address.city}, {site.address.state} {site.address.postalCode}
                </address>
              </div>
            </li>
            <li className="flex gap-4">
              <Clock aria-hidden="true" className="mt-1 size-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-bold text-cream">Hours</h3>
                {site.hours.map((h) => (
                  <p key={h.days} className="text-muted">{h.days}: <span className="text-cream">{h.time}</span></p>
                ))}
              </div>
            </li>
            <li className="flex gap-4">
              <Phone aria-hidden="true" className="mt-1 size-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-bold text-cream">Phone</h3>
                <a href={`tel:${site.phoneE164}`} className="text-gold underline underline-offset-4">{site.phoneDisplay}</a>
              </div>
            </li>
            <li className="flex gap-4">
              <Utensils aria-hidden="true" className="mt-1 size-6 shrink-0 text-gold" />
              <div>
                <h3 className="font-bold text-cream">Services</h3>
                <p className="text-muted">{site.services.join(" · ")} · {site.priceRange}</p>
              </div>
            </li>
          </ul>
        </Reveal>
        <Reveal delay={0.15}><ConsentMap /></Reveal>
      </div>
    </section>
  );
}
