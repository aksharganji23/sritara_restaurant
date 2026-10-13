import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { MenuSection } from "@/components/MenuSection";
import { About } from "@/components/About";
import { Gallery } from "@/components/Gallery";
import { Reviews } from "@/components/Reviews";
import { Visit } from "@/components/Visit";
import { Reserve } from "@/components/Reserve";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <MenuSection />
      <About />
      <Gallery />
      <Reviews />
      <Visit />
      <Reserve />
    </>
  );
}
