import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/privacy-policy", "/cookie-policy", "/terms", "/refund-policy"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: p ? "yearly" : "monthly",
    priority: p ? 0.3 : 1,
  }));
}
