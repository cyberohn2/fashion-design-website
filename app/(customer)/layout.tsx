import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { cn } from "@/lib/utils";
import Footer from "@/components/app-components/layout/footer";
import { AuthContextProvider } from "@/contexts/AuthContext";
import Header from "@/components/app-components/layout/header";
import { Toaster } from "@/components/ui/sonner";

const lamoricRowen = localFont({
  variable: "--font-lamoric-rowen",
  src: "../../assets/fonts/Lamoric Rowen TTF.ttf",
});

const ZTNature = localFont({
  variable: "--font-ztnature",
  src: [
    {
      path: "../../assets/fonts/ZTNature-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../assets/fonts/ZTNature-Black.ttf",
      weight: "800",
      style: "bold"
    },
    {
      path: "../../assets/fonts/ZTNature-Thin.ttf",
      weight: "200",
      style: "light"
    },
    {
      path: "../../assets/fonts/ZTNature-MediumItalic.ttf",
      weight: "500",
      style: "italic"
    },
    {
      path: "../../assets/fonts/ZTNature-BlackItalic.ttf",
      weight: "800",
      style: "italic"
    },
    {
      path: "../../assets/fonts/ZTNature-ThinItalic.ttf",
      weight: "200",
      style: "italic"
    }
  ]
})

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
      className={cn(
        "h-full",
        "scroll-smooth",
        "antialiased",
        lamoricRowen.variable,
        ZTNature.variable,
      )}
    >
      <body
        className={`min-h-full flex flex-col relative ${(lamoricRowen.className, ZTNature.className)}`}
      >
        <Toaster />
      <AuthContextProvider>
        <Header />
          {children}
        <Footer />
      </AuthContextProvider>
      </body>
    </html>
  );
}
