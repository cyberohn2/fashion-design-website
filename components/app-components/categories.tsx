import { CategoryCard } from "./category-card";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const Categories = () => {
    const sampleCategories = [
        {
            title: "Female Native",
            description: "Explore our latest collection of women's clothing and accessories.",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Male Native",
            description: "Discover the newest trends in men's fashion.",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Corporate Male",
            description: "Find the perfect corporate attire for men.",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Corporate Female",
            description: "Find the perfect corporate attire for women.",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        },
        {
            title: "Street Wears",
            description: "Explore our latest collection of streetwear clothing and accessories.",
            imageUrl: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

  return (
    <section className="py-14 md:pt-24">
      <div className="container mx-auto px-4">
        <h2 className="lg:text-5xl md:text-4xl text-2xl lg:leading-18 md:leading-10 font-bold">
          Categories
        </h2>
        <Carousel className="mt-8">
          <CarouselContent className="isolate">
            {sampleCategories.map((category, index) => (
              <CarouselItem
                className="bg-transparent md:basis-1/2 lg:basis-1/3 py-0 "
                key={index}
              >
                <CategoryCard
                  title={category.title}
                  description={category.description}
                  imageUrl={category.imageUrl}
                />
              </CarouselItem>
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
