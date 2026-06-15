"use client";

import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

type NavLinkProps = {
  href: LinkProps["href"];
  children: ReactNode;
  exact?: boolean;
  className?: string;
};

export default function NavLink({
  href,
  children,
  exact = true,
  className = "",
}: NavLinkProps) {
  const pathname = usePathname();
 
  const isActive = exact
    ? pathname === href
    : pathname.startsWith(String(href));

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? "bg-red-500!" : ""}`}
    >
      {children}
    </Link>
  );
}
