import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const CustomOrderCTA = () => {
  return (
    <section className="py-8 md:py-14 border-y bg-muted-foreground text-white">
        <div className="container mx-auto px-4 grid grid-rows-2 gap-8 md:gap-0 md:grid-cols-2 md:grid-rows-1 mt-10">
            <div className="md:pt-20 lg:pt-4">
                <Image
                    className="w-[60%] aspect-auto mx-auto"
                    width={500}
                    height={500}
                    src={"/male.webp"}
                    alt="three men in senator"
                />
            </div>
            <div className="flex flex-col justify-center items-start">
                <h2 className="lg:text-5xl md:text-4xl text-2xl lg:leading-18 md:leading-10 font-bold">
                    Create Custom Order
                </h2>
                <p className="leading-10 mb-6 text-chart-1!">
                    Create a custom Luxury bespoke and ready-to-wear fashion <br />
                    designed for modern individuals.
                </p>
                <Button className="bg-black py-6 rounded-sm mr-4">
                    <Link href={"/browse"}>Create Order</Link>
                </Button>
            </div>
        </div>
    </section>
  );
};

export default CustomOrderCTA;
