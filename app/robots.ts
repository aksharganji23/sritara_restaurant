import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.sritaraclassic.in";
  return { rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/media"] }, sitemap: `${url}/sitemap.xml` };
}
