import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="py-12 md:py-16 bg-foreground text-white">
      <div className="container mx-auto px-4 grid grid-cols-1 gap-10 border-b border-[#9999994b] pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div className="md:col-span-2 lg:col-span-1">
          <Image
            className="w-auto h-auto"
            src="/logo.webp"
            alt="george-wears-logo"
            width={50}
            height={50}
          />
          <p className="mt-4 max-w-md leading-relaxed text-[#999999]">
            Stand out with premium bespoke and ready-made outfits crafted
            for confidence, elegance, and individuality.
          </p>
        </div>

        <div>
          <p className="mb-5 text-[#999999]">Website</p>
          <ul className="space-y-3">
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit"><Link href={"/login"}>Login</Link></li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit"><Link href={"/signup"}>Sign Up</Link></li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit"><Link href={"/catalog"}>Catalog</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[#999999]">Contact</p>
          <ul className="space-y-3">
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">
              <Link href={"/contact-us"}>Contact form</Link>
            </li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit"><Link href="mailto:georgedezzy@gmail.com">Email us</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[#999999]">Social Media</p>
          <ul className="space-y-3">
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">Facebook</li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">
              Instagram
            </li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">Twitter</li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">Youtube</li>
          </ul>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8 flex flex-col gap-5 text-sm md:mt-10 md:flex-row md:items-center md:justify-between md:text-base">
        <h2 className="text-[18px] font-medium md:text-[20px]">
          George Wears &copy; 2026
        </h2>
      </div>
    </footer>
  );
}

export default Footer
