"use client"
import { useMemo, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ProductType } from '@/components/app-components/catalog/product-card';
import DressCard from './dress-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ArrowUpRightIcon, SearchSlash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from "sonner";
import { dressCategory } from '@/lib/lib';
import { getPaginationItems } from '@/lib/getPaginationItems';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const DressList = ({
  Dresses,
  totalDress,
  page,
}: {
  Dresses?: ProductType[];
  totalDress: number;
  page: number;
}) => {

  const [fetchedDresses, setFetchedDresses] = useState({
    Dresses,
    totalDress,
    page,
  });
  
  // filter fn
  const [filters, setFilters] = useState<string[]>([]);
  const toggleFilter = (value: string) => {
    setFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };
  const filteredDresses = useMemo(() => {
    if (filters.length === 0) {
      return fetchedDresses.Dresses;
    }

    return fetchedDresses.Dresses?.filter((dress) => {
      if (filters.includes("published") && dress.isPublished) {
        return true;
      }

      if (filters.includes("unpublished") && !dress.isPublished) {
        return true;
      }

      return filters.includes(dress.category);
    });
  }, [fetchedDresses.Dresses, filters]);

  // sort fn
  const [ sortBy, setSortBy ] = useState("relevance")
  const sortedDresses = useMemo(() => {
    if (sortBy === "relevance") return filteredDresses;

    const sorted = filteredDresses && [...filteredDresses];

    switch (sortBy) {

      case "sales-low":
        return sorted?.sort((a, b) => a.soldCount - b.soldCount);

      case "sales-high":
        return sorted?.sort((a, b) => b.soldCount - a.soldCount);

      default:
        return filteredDresses;
    }
  }, [fetchedDresses.Dresses, sortBy]);

  // pagination fn
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(
    fetchedDresses.totalDress / ITEMS_PER_PAGE,
  );
  const paginationItems = getPaginationItems(fetchedDresses.page, totalPages);

  // fetch new page data
  const [isFetching, setIsFetching] = useState(false);
  const handleFetchedDressesDetails = async (page: number) => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    const newDresses = await fetch(`/api/admin/dress?page=${page}`);
    if (newDresses.ok) {
      newDresses.json().then((data) => {
        setFetchedDresses({
          Dresses: data.AllDresses,
          totalDress: data.totalDresses,
          page: page,
        });
        setIsFetching(false);
      });
    } else {
      setFetchedDresses((prev) => prev);
      toast.error("Error fetching data.", {
        position: "top-right",
      });
      setIsFetching(false);
    }
  };

  return (
    <Card className="p-0! border-none shadow-none">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Dresses
        </h1>
        <div className="flex items-center gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent className="z-10 bg-card rounded-sm shadow">
              <SelectGroup>
                <SelectLabel>Sort By</SelectLabel>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="sales-low">Sales: Low to High</SelectItem>
                <SelectItem value="sales-high">Sales: High to Low</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Filters {filters.length > 0 && `(${filters.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Dress Category</DropdownMenuLabel>
              {dressCategory.map((category, index) => (
                <DropdownMenuCheckboxItem
                  key={index}
                  checked={filters.includes(category)}
                  onCheckedChange={() => toggleFilter(category)}
                >
                  {category.toLowerCase().replace(/_/g, " ")}
                </DropdownMenuCheckboxItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={filters.includes("PUBLISHED")}
                onCheckedChange={() => toggleFilter("PUBLISHED")}
              >
                Published
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={filters.includes("UNPUBLISHED")}
                onCheckedChange={() => toggleFilter("UNPUBLISHED")}
              >
                Unpublished
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedDresses?.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchSlash />
              </EmptyMedia>
              <EmptyTitle>Nothing here!</EmptyTitle>
              <EmptyDescription>
                You haven't listed any product.
              </EmptyDescription>
              <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
              >
                <Link href="#">
                  Create new Dress <ArrowUpRightIcon />
                </Link>
              </Button>
            </EmptyHeader>
          </Empty>
        ) : (
          sortedDresses?.map((dress) => <DressCard dress={dress} />)
        )}
      </CardContent>
      <CardFooter>
        <Pagination className="py-5 mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handleFetchedDressesDetails(page - 1)}
                aria-disabled={page === 1}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {paginationItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handleFetchedDressesDetails(page)}
                    isActive={item === page}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handleFetchedDressesDetails(page + 1)}
                aria-disabled={page === totalPages}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}

export default DressList
