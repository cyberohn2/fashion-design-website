import Image from "next/image"
import Link from "next/link"
import { Button } from "../ui/button"


const Hero = () => {
  return (
    <section className="py-24 pt-34 md:pt-24 relative h-screen flex items-center justify-center">
      <div className="grid grid-rows-2 gap-8 md:gap-0 md:grid-cols-2 md:grid-rows-1 container mx-auto px-4">
        <div className="pt-60 md:pt-20 md:row-start-auto text-center md:text-left flex flex-col align-center">
          <h1 className="lg:text-7xl md:text-5xl text-4xl lg:leading-24 md:leading-14 font-bold">
            Wear Confidence, With <br />
            <span className="bg-black text-white ">George Wears</span>
          </h1>
          <p className="mt-4 mb-6">
            Stand out with premium bespoke and ready-made outfits <br /> crafted
            for confidence, elegance, and individuality.
          </p>
          <div>
            <Button className="bg-black py-6 rounded-sm mr-4">
              <Link href="/browse">Browse Catalog</Link>
            </Button>
            <Button className="py-6 bg-transparent text-black rounded-sm border border-black">
              <Link href="/new-order">Custom Order</Link>
            </Button>
          </div>
        </div>
        <div className="md:pt-20 lg:pt-4">
          <Image
            className="w-[60%] aspect-auto mx-auto"
            width={500}
            height={500}
            src={"/three-men.webp"}
            alt="three men in senator"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero
