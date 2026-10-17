import { cache } from "react";
import { getSiteContent } from "./store";
import { deriveSite } from "../site";

/** One DB read per request, shared by layout, pages and metadata. */
export const getSite = cache(async () => {
  const content = await getSiteContent();
  return { ...content, site: deriveSite(content.settings) };
});
