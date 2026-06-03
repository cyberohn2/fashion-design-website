import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-12 md:py-16">
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
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">Services</li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">Pricing</li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">About</li>
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[#999999]">Contact</p>
          <ul className="space-y-3">
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">
              Get a quote
            </li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">
              Contact form
            </li>
            <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">Email us</li>
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
        <ul className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[#999999]">
          <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">
            Cookie Policy
          </li>
          <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">
            Terms of service
          </li>
          <li className="hover:text-[#cccccc] cursor-pointer transition-colors w-fit">
            Privacy policy
          </li>
        </ul>
      </div>
    </footer>
  );
}

export default Footer
