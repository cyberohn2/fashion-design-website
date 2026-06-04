"use client"
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { motion } from "framer-motion"

const CustomOrderCTA = () => {
  return (
    <section className="py-8 md:py-14 border-y bg-muted-foreground text-white">
      <div className="container mx-auto px-4 grid grid-rows-2 gap-8 md:gap-0 md:grid-cols-2 md:grid-rows-1 mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="md:pt-20 lg:pt-4"
        >
          <Image
            className="w-[60%] aspect-auto mx-auto"
            width={500}
            height={500}
            src={"/male.webp"}
            alt="three men in senator"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col justify-center items-start"
        >
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
        </motion.div>
      </div>
    </section>
  );
};

export default CustomOrderCTA;
