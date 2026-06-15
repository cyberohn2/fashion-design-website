"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MenuIcon, SearchIcon, ShoppingCart, XIcon } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SubmitEvent, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";
import UserMenu from "./UserMenu";


const Header = () => {
  const { userState } = useAuthContext();
  const router = useRouter()
  const [searchVisible, setSearchVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("")

  const toggleSearch = () => {
    setSearchVisible(!searchVisible);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    if(searchTerm !== "") router.push(`/catalog?searchTerm=${searchTerm}`);
  }

  return (
    <header className="bg-foreground/70 px-4 py-2 backdrop-blur-md shadow-lg fixed w-full top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between ">
        <Link href={"/"}>
          <Image
            className="w-auto h-auto"
            src="/logo.webp"
            alt="george-wears-logo"
            width={50}
            height={50}
          />
        </Link>
        <ul className="hidden md:flex items-center gap-4 text-white">
          <Link href="/catalog">
            <li className="flex items-center gap-1">
              <ShoppingCart size={16} />
              <span className="hidden md:block">Catalog</span>{" "}
            </li>
          </Link>
          <Link href="/contact-us">
            <li>Contact Us</li>
          </Link>
          <Link href={"/#services"}>
            <li>Services</li>
          </Link>
        </ul>
        <div className="flex items-center gap-2">
          <form onSubmit={handleSubmit} className=" flex gap-2">
            <InputGroup
              onBlur={toggleSearch}
              className={`rounded-full hidden md:flex ${searchVisible && "flex"}`}
            >
              <InputGroupInput
                className="placeholder:text-white/80 min-w-10! placeholder:hidden "
                placeholder="Search..."
                id="search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <InputGroupAddon>
                <SearchIcon />
              </InputGroupAddon>
            </InputGroup>
            <Label htmlFor="search">
              <SearchIcon
                onClick={toggleSearch}
                className={` md:hidden ${searchVisible && "hidden"}`}
                color="white"
              />
            </Label>
          </form>
          <Button
            variant={"ghost"}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden z-1000"
          >
            {isMenuOpen ? <XIcon color="white" /> : <MenuIcon color="white" />}
          </Button>
          {userState.user && <UserMenu />}
        </div>
      </nav>

      {/* mobile menu */}
      <div
        className={`md:hidden absolute inset-0 bg-foreground/95 backdrop-blur-lg pt-32 h-screen transition-transform duration-300 ease-in-out overflow-hidden  ${isMenuOpen ? "translate-x-0" : "translate-x-[110%] z-40"}`}
      >
        <nav className="container mx-auto px-4 space-y-10 flex flex-col items-center">
          <ul className="flex flex-col items-center gap-4 text-white">
            <Link onClick={() => setIsMenuOpen(false)} href="/catalog">
              <li className="flex items-center gap-1">
                <span className="hidden md:block">Catalog</span>{" "}
                <ShoppingCart size={8} />
              </li>
            </Link>
            <Link onClick={() => setIsMenuOpen(false)} href="/contact-us">
              <li>Contact Us</li>
            </Link>
            <Link onClick={() => setIsMenuOpen(false)} href="#services">
              <li>Services</li>
            </Link>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header
