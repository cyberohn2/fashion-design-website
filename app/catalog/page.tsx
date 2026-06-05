"use client"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import ProductCard, {
  ProductType,
} from "@/components/app-components/product-card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ItemSkeletonGrid } from "@/components/ui/skeleton-grid";
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { SearchSlash } from "lucide-react";
import { useMemo, useState } from "react";

const page = () => {
  const sampleData: { products: ProductType[] } = {
    products: [
      {
        id: "1",
        title: "Royal Blue Agbada",
        slug: "royal-blue-agbada",
        description:
          "Premium royal blue Agbada made with high-quality fabric for weddings, ceremonies, and special occasions.",
        category: "MALE_NATIVE",
        gender: "MALE",
        base_price: "85000",
        stock: 15,
        thumbnail: "/bespoke.webp",
        images: [
          "https://example.com/images/royal-blue-agbada-1.jpg",
          "https://example.com/images/royal-blue-agbada-2.jpg",
          "https://example.com/images/royal-blue-agbada-3.jpg",
        ],
        reviews: [
          {
            rating: 4.5,
            count: 120,
          },
        ],
      },
      {
        id: "2",
        title: "Elegant Ankara Gown",
        slug: "elegant-ankara-gown",
        description:
          "Stylish Ankara gown designed for modern women who appreciate African fashion.",
        category: "FEMALE_NATIVE",
        gender: "FEMALE",
        base_price: "45000",
        stock: 20,
        thumbnail: "/bespoke.webp",
        images: [
          "https://example.com/images/elegant-ankara-gown-1.jpg",
          "https://example.com/images/elegant-ankara-gown-2.jpg",
          "https://example.com/images/elegant-ankara-gown-3.jpg",
        ],
        reviews: [
          {
            rating: 4.7,
            count: 95,
          },
        ],
      },
      {
        id: "3",
        title: "Classic Corporate Suit",
        slug: "classic-corporate-suit",
        description:
          "Professional two-piece corporate suit suitable for office wear and business meetings.",
        category: "CORPORATE_MALE",
        gender: "MALE",
        base_price: "120000",
        stock: 10,
        thumbnail: "/bespoke.webp",
        images: [
          "https://example.com/images/classic-corporate-suit-1.jpg",
          "https://example.com/images/classic-corporate-suit-2.jpg",
          "https://example.com/images/classic-corporate-suit-3.jpg",
        ],
        reviews: [
          {
            rating: 4.2,
            count: 80,
          },
        ],
      },
      {
        id: "4",
        title: "Womens Office Blazer Set",
        slug: "womens-office-blazer-set",
        description:
          "Sophisticated blazer and trouser set tailored for female professionals.",
        category: "CORPORATE_FEMALE",
        gender: "FEMALE",
        base_price: "95000",
        stock: 12,
        thumbnail: "/bespoke.webp",
        images: [
          "https://example.com/images/womens-office-blazer-set-1.jpg",
          "https://example.com/images/womens-office-blazer-set-2.jpg",
          "https://example.com/images/womens-office-blazer-set-3.jpg",
        ],
        reviews: [
          {
            rating: 4.8,
            count: 60,
          },
        ],
      },
      {
        id: "5",
        title: "Urban Street Hoodie",
        slug: "urban-street-hoodie",
        description:
          "Trendy oversized hoodie perfect for streetwear enthusiasts and casual outings.",
        category: "STREET_WEAR",
        gender: "UNISEX",
        base_price: "35000",
        stock: 30,
        thumbnail: "/bespoke.webp",
        images: [
          "https://example.com/images/urban-street-hoodie-1.jpg",
          "https://example.com/images/urban-street-hoodie-2.jpg",
          "https://example.com/images/urban-street-hoodie-3.jpg",
        ],
        reviews: [
          {
            rating: 4.3,
            count: 150,
          },
        ],
      },
    ],
  };

  

  return (
    <main className="py-24 pt-34 md:pt-24 container mx-auto px-4">
      <div>
        <Select >
          <SelectTrigger className="">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="z-10 bg-card rounded-sm shadow">
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="relevant">Relevant</SelectItem>
              <SelectItem value="best-selling">Best Selling</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        className={`${sampleData.products.length > 0 && "grid"} gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 border-y mt-8`}
      >
        {sampleData.products.length < 0 ? (
          <ItemSkeletonGrid />
        ) : sampleData.products.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchSlash />
              </EmptyMedia>
              <EmptyTitle>No Results for that search</EmptyTitle>
              <EmptyDescription>Try refining your query.</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          sampleData.products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
      <Pagination className="py-5">
        <PaginationContent>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </main>
  );
};

export default page;
