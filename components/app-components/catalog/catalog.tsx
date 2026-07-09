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
import DressCard, { DressType } from "./dress-card";
import { toast } from "sonner";
import { getPaginationItems } from "@/lib/getPaginationItems";
import { ReusablePagination } from "@/components/ui/reusable-pagination";

const Catalog = ({
  dresses,
  totalDresses,
  page,
}: {
  dresses: DressType[] | undefined;
  totalDresses: number;
  page: number;
}) => {
  const [fetchedDresses, setFetchedDresses] = useState({
    dresses,
    totalDresses,
    page,
  });

  const [sortBy, setSortBy] = useState<string>("relevant");

  const sortedDresses = useMemo(() => {
    if (sortBy === "relevant") return fetchedDresses.dresses;

    const sorted = fetchedDresses.dresses && [...fetchedDresses.dresses];

    switch (sortBy) {
      case "trending":
        return sorted?.sort(
          (a, b) =>
            (b.reviews?.length as number) - (a.reviews?.length as number),
        );

      case "latest":
        return sorted?.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );

      case "price-low":
        return sorted?.sort((a, b) => Number(a.base_price) - Number(b.base_price));

      case "price-high":
        return sorted?.sort((a, b) => Number(b.base_price) - Number(a.base_price));

      default:
        return fetchedDresses.dresses;
    }
  }, [fetchedDresses.dresses, sortBy]);

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(fetchedDresses.totalDresses / ITEMS_PER_PAGE);
  const paginationItems = getPaginationItems(fetchedDresses.page, totalPages);

  const [isFetching, setIsFetching] = useState(false);

  const handleFetchedDresses = async (page: number) => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    const newDresses = await fetch(`/api/dresses?page=${page}`);
    if (newDresses.ok) {
      newDresses.json().then((data) => {
        setFetchedDresses({
          dresses: data.AllDresses,
          totalDresses: data.totalDresses,
          page: data.page,
        });
        setIsFetching(false);
      });
    } else {
      setFetchedDresses((prev) => prev);
      toast.error("Error fetching dresses.", {
        position: "top-right",
      });
      setIsFetching(false);
    }
  };

  return (
    <section className="">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
          Catalog
        </h1>
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
        className={`${sortedDresses && sortedDresses?.length > 0 && "grid"} gap-4 md:grid-cols-2 lg:grid-cols-4 mt-4 min-h-screen`}
      >
        {sortedDresses && sortedDresses?.length < 0 ? (
          <ItemSkeletonGrid />
        ) : sortedDresses?.length === 0 ? (
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
          sortedDresses?.map((dress) => (
            <DressCard key={dress.id} dress={dress} />
          ))
        )}
      </div>
      <ReusablePagination
        className="py-5 mt-auto"
        page={fetchedDresses.page}
        totalPages={totalPages}
        paginationItems={paginationItems}
        onPageChange={handleFetchedDresses}
      />
    </section>
  );
};

export default Catalog
