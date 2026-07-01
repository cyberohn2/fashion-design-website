"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Spotlight } from "@/components/ui/spotlight";
import SplitType from "split-type";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useIsMobile } from "@/hooks/use-mobile";



const Hero = () => {
  gsap.registerPlugin(ScrollTrigger);
  const isMobile  = useIsMobile()

  useEffect(() => {
    const parallaxAnimation = () => {
      gsap.to(".hero-image", {
        scrollTrigger: {
          trigger: ".hero",
          start: "20px 20px",
          end: "bottom top",
          scrub: 2,
          // pin: true,
          // markers: true,
        },
        position: "absolute",
        top: isMobile ? "110%" : "130%",
        left: 50,
        scale: !isMobile ? 0.9 : 1,
        duration: 5,
        ease: "power1.out",
      });
    };

    parallaxAnimation();
  }, [isMobile]);


  useEffect(() => {
    let herotext = new SplitType("#hero-text");
    let heroChars = document.querySelectorAll(".word");

    for (let i = 0; i < heroChars.length; i++) {
      heroChars[i].classList.add("translate-y-full");
      heroChars[i].classList.add("cliptext");
    }

    gsap.to(".word", {
      duration: 1,
      stagger: 0.1,
      y: 0,
    });
    gsap.to(".hero-para", {
      duration: 1,
      stagger: 0.1,
      x: 0,
      y: -8,
      opacity: 1,
      delay: 0.3,
    });
    gsap.to(".hero-image", {
      duration: 1.5,
      stagger: 0.1,
      x: 0,
      opacity: 1,
      delay: 0.5,
    });
  }, []);


  return (
    <section className="hero py-24 pt-24 relative h-screen flex items-center justify-center isolate border-b">
      <Spotlight
        className="-top-40 left-0 md:-top-20 md:left-60"
        fill="black"
      />
      <div
        className={cn(
          "absolute inset-0 -z-50 opacity-60",
          "bg-size-[40px_40px]",
          "bg-[linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:bg-[linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]",
        )}
      />

      <div className=" grid grid-rows-2 gap-8 md:gap-0 md:grid-cols-2 md:grid-rows-1 container mx-auto px-4 relative ">
        <div className="pt-60 md:pt-20 md:row-start-auto text-center md:text-left flex flex-col align-center">
          <h1 className="lg:text-7xl md:text-5xl text-2xl lg:leading-24 md:leading-14 font-bold">
            <TextGenerateEffect
              className="lg:text-7xl md:text-5xl text-3xl lg:leading-24 md:leading-14 font-bold"
              duration={1}
              words={"Wear Confidence, With George Wears"}
            />{" "}
          </h1>
          <p
            style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)" }}
            className="hero-para mt-4 mb-6"
          >
            Stand out with premium bespoke and ready-made outfits <br /> crafted
            for confidence, elegance, and individuality.
          </p>
          <div>
            <Button className="bg-black py-6 rounded-sm mr-4">
              <Link href="/catalog">Browse Catalog</Link>
            </Button>
            <Button className="py-6 bg-transparent text-black rounded-sm border border-black">
              <Link href="/create-order">Custom Order</Link>
            </Button>
          </div>
        </div>
        <div className="md:pt-20 lg:pt-4 max-w-125 min-h-125">
          <Image
            className="md:w-[30%] w-[50%] aspect-auto hero-image opacity-0 absolute mx-auto right-28 md:right-auto md:left-2/3"
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
