"use client"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion"

const Features = () => {
  return (
    <section className="py-24 pt-30 md:pt-24">
      <div className="container mx-auto px-4">
        <h2 className="lg:text-5xl md:text-4xl text-2xl lg:leading-18 md:leading-10 font-bold">
          New Designs
        </h2>
        <div className="grid grid-rows-2 gap-8 md:gap-0 md:grid-cols-2 md:grid-rows-1 mt-10">
          <div className="parallax-to max-w-125 md:h-125 h-80"></div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center items-start"
          >
            <p className="leading-10 mb-6">
              Check out some our current and trendy ready-made designs, <br />{" "}
              crafted to boost your confidence, elegance, and individuality.
            </p>
            <Button className="bg-black py-6 rounded-sm mr-4">
              <Link href={"/catalog"}>Browse Catalog</Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default Features
