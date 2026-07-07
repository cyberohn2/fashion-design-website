"use client"
import { useMemo, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { DressType } from "@/components/app-components/catalog/dress-card";
import DressCard from "./dress-card";
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
import { ArrowUpRightIcon, SearchSlash, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { dressCategory } from "@/lib/lib";
import { getPaginationItems } from "@/lib/getPaginationItems";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReusablePagination } from '@/components/ui/reusable-pagination';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

const DressList = ({
  Dresses,
  totalDress,
  page,
}: {
  Dresses?: DressType[];
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

    return fetchedDresses.Dresses?.filter(
      (dress) =>
        (filters.includes("unpublished") && !dress.isPublished) ||
        filters.includes(dress.category),
    );
  }, [fetchedDresses.Dresses, filters]);

  // sort fn
  const [sortBy, setSortBy] = useState("relevance");
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
  const totalPages = Math.ceil(fetchedDresses.totalDress / ITEMS_PER_PAGE);
  const paginationItems = getPaginationItems(fetchedDresses.page, totalPages);

  // fetch new page data
  const [isFetching, setIsFetching] = useState(false);
  const handleFetchedDresses = async (page: number) => {
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
          page: data.page,
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

  // search fn
  const [searchTerm, setSearchTerm] = useState<string>();
  const [showSearch, setShowSearch] = useState<string>();
  const handleSearch = async (page?: number) => {
    if (isFetching) {
      return;
    }
    if (!searchTerm) {
      return;
    }
    setIsFetching(true);
    const searchResult = await fetch(`/api/admin/dress/search`, {
      method: "POST",
      body: JSON.stringify({ searchTerm, page: page || 1 }),
    });
    if (searchResult.ok) {
      searchResult.json().then((data) => {
        setFetchedDresses({
          Dresses: data.AllDresses,
          totalDress: data.totalDresses,
          page: data.page,
        });
        setShowSearch(`Showing Results For ${searchTerm}`);
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
    <Card className="p-0! border-none shadow-none">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Dresses
        </h1>
        <div className="flex items-center gap-2">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch();
            }}
            className=" flex gap-2"
          >
            <InputGroup className={`rounded-full flex}`}>
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
              <InputGroupAddon
                onClick={() => setSearchTerm(undefined)}
                align={"inline-end"}
              >
                <XIcon />
              </InputGroupAddon>
            </InputGroup>
            <Label htmlFor="search">
              <SearchIcon color="white" />
            </Label>
          </form>
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
                checked={filters.includes("unpublished")}
                onCheckedChange={() => toggleFilter("unpublished")}
              >
                Unpublished
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p>{showSearch}</p>
        {sortedDresses?.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchSlash />
              </EmptyMedia>
              <EmptyTitle>Nothing here!</EmptyTitle>
              <EmptyDescription>You haven't listed any dress.</EmptyDescription>
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
        <ReusablePagination
          className="py-5 mt-auto"
          page={fetchedDresses.page}
          totalPages={totalPages}
          paginationItems={paginationItems}
          onPageChange={
            searchTerm
              ? (page) => handleSearch(page)
              : (page) => handleFetchedDresses(page)
          }
        />
      </CardFooter>
    </Card>
  );
};

export default DressList
