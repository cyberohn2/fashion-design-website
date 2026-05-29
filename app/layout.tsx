import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { cn } from "@/lib/utils";
import Header from "@/components/app-components/header";
import Footer from "@/components/app-components/footer";

const lamoricRowen = localFont({
  variable: "--font-lamoric-rowen",
  src: "../assets/fonts/Lamoric Rowen TTF.ttf",
});

export const metadata: Metadata = {
  title: "George Wears Fashion Design",
  description: "George Wears Fashion Design is a fashion design company in Akure, Nigeria that specializes in creating unique and stylish clothing for men and women. We are dedicated to providing our customers with high-quality clothing that is both fashionable and comfortable. Our team of experienced designers and tailors work tirelessly to create clothing that is both trendy and timeless. Whether you're looking for a casual outfit or a formal ensemble, George Wears Fashion Design has something for everyone. We pride ourselves on our attention to detail and our commitment to customer satisfaction. Shop with us today and experience the difference that George Wears Fashion Design can make in your wardrobe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", lamoricRowen.className)}
    >
      <Header/>
      <body className="min-h-full flex flex-col">{children}</body>
      <Footer />
    </html>
  );
}
