import Categories from "@/components/app-components/categories";
import CustomOrderCTA from "@/components/app-components/custom-order-cta";
import Features from "@/components/app-components/features";
import Hero from "@/components/app-components/hero";
import { Services } from "@/components/app-components/services";
import Socials from "@/components/app-components/socials";


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
