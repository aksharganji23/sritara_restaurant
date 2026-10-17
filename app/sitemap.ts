import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sritaraclassic.in";
  return ["", "/privacy-policy", "/cookie-policy", "/terms", "/refund-policy"].map((p) => ({
    url: `${url}${p}`,
    changeFrequency: p ? "yearly" : "weekly",
    priority: p ? 0.3 : 1,
  }));
}
