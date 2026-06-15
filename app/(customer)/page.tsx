import Categories from "@/components/app-components/home-page/categories";
import CustomOrderCTA from "@/components/app-components/home-page/custom-order-cta";
import Features from "@/components/app-components/home-page/features";
import Hero from "@/components/app-components/home-page/hero";
import { Services } from "@/components/app-components/home-page/services";
import Socials from "@/components/app-components/home-page/socials";


export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Categories />
      <CustomOrderCTA />
      <Services />
      <Socials />
    </main>
  );
}
