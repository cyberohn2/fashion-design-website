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

const Catalog = ({ products }: { products: ProductType[] }) => {
    
    const [sortBy, setSortBy] = useState<string>("relevant");

    const sortedProducts = useMemo(() => {
      if (sortBy === "relevant") return products;

      const sorted = [...products];

      switch (sortBy) {
        case "trending":
          return sorted.sort((a, b) => b.reviews.length - a.reviews.length);

        case "latest":
          return sorted.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          );

        case "price-low":
          return sorted.sort((a, b) => a.base_price - b.base_price);

        case "price-high":
          return sorted.sort((a, b) => b.base_price - a.base_price);

        default:
          return products;
      }
    }, [products, sortBy]);


  return (
    <div>
      <div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="z-10 bg-card rounded-sm shadow">
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="relevant">Relevant</SelectItem>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div
        className={`${sortedProducts.length > 0 && "grid"} gap-4 md:grid-cols-2 lg:grid-cols-4 p-4 border-y mt-8`}
      >
        {sortedProducts.length < 0 ? (
          <ItemSkeletonGrid />
        ) : sortedProducts.length === 0 ? (
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
          sortedProducts.map((product) => (
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
    </div>
  );
}

export default Catalog
