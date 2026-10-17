import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MenuSection } from "@/components/MenuSection";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Visit } from "@/components/Visit";
import { Reserve } from "@/components/Reserve";
import { getSite } from "@/lib/content/get-site";

export default async function Home() {
  const { site, menu, photos } = await getSite();
  const dishes = menu.flatMap((c) => c.items);
  const ribbon = (dishes.some((d) => d.signature) ? dishes.filter((d) => d.signature) : dishes).slice(0, 8).map((d) => d.name);

  return (
    <>
      <Hero name={site.name} heroTitle={site.heroTitle} heroHighlight={site.heroHighlight} heroText={site.heroText} rating={site.rating} />
      <Marquee items={ribbon} />
      {menu.length > 0 && <MenuSection menu={menu} />}
      <About site={site} dishCount={dishes.length} categoryCount={menu.length} />
      <Gallery photos={photos} />
      <Reviews site={site} />
      <Visit site={site} />
      <Reserve site={site} />
    </>
  );
}
