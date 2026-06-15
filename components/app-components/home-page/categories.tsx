"use client"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { motion } from "framer-motion"
import { CategoryCard } from "./category-card";

const Categories = () => {
    const sampleCategories = [
        {
            title: "Female Native",
            description: "Explore our latest collection of women's clothing and accessories.",
            imageUrl: "/three-men.webp"
        },
        {
            title: "Male Native",
            description: "Discover the newest trends in men's fashion.",
            imageUrl: "/three-men.webp"
        },
        {
            title: "Corporate Male",
            description: "Find the perfect corporate attire for men.",
            imageUrl: "/three-men.webp"
        },
        {
            title: "Corporate Female",
            description: "Find the perfect corporate attire for women.",
            imageUrl: "/three-men.webp"
        },
        {
            title: "Street Wears",
            description: "Explore our latest collection of streetwear clothing and accessories.",
            imageUrl: "/three-men.webp"
        }
    ];

  return (
    <section className="py-14 md:pt-24 border-t">
      <div className="container mx-auto px-4">
        <h2 className="lg:text-5xl md:text-4xl text-2xl lg:leading-18 md:leading-10 font-bold">
          Categories
        </h2>
        <Carousel className="mt-8">
          <CarouselContent className="isolate">
            {sampleCategories.map((category, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.2 }}
                transition={{ duration: 0.5, delay: 0.2 * index }}
                key={index}
              >
                <CarouselItem
                  className="bg-transparent md:basis-1/2 lg:basis-1/3 py-0 "
                >
                  <CategoryCard
                    title={category.title}
                    description={category.description}
                    imageUrl={category.imageUrl}
                  />
                </CarouselItem>
              </motion.div>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-6 gap-4">
            <CarouselPrevious
              variant={"outline"}
              size={"icon-lg"}
              className="static bg-white shadow-sm"
            />
            <CarouselNext
              variant={"outline"}
              size={"icon-lg"}
              className="static bg-white shadow-sm "
            />
          </div>
        </Carousel>
      </div>
    </section>
  );
}

export default Categories
