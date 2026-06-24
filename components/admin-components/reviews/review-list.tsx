"use client"
import { useState } from 'react'
import ReviewCard, { Review } from './review-card';
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchSlash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const ReviewList = ({
  Reviews,
  totalReview,
  page,
}: {
  Reviews?: Review[];
  totalReview: number;
  page: number;
}) => {

    const [fetchedReviewDetails, setFetchedReviewDetails] = useState({
        Reviews,
        totalReview,
        page,
      });
      const [filterBy, setFilterBy] = useState<string>();
    
      const ITEMS_PER_PAGE = 20;
    
      const totalPages = Math.ceil(
        fetchedReviewDetails.totalReview / ITEMS_PER_PAGE,
      );
    
      const getPaginationItems = () => {
        const items: (number | "ellipsis")[] = [];
    
        // Always show first page
        items.push(1);
    
        // Left ellipsis
        if (fetchedReviewDetails.page > 3) {
          items.push("ellipsis");
        }
    
        // Pages around current page
        for (
          let i = Math.max(2, fetchedReviewDetails.page - 1);
          i <= Math.min(totalPages - 1, fetchedReviewDetails.page + 1);
          i++
        ) {
          items.push(i);
        }
    
        // Right ellipsis
        if (fetchedReviewDetails.page < totalPages - 2) {
          items.push("ellipsis");
        }
    
        // Always show last page
        if (totalPages > 1) {
          items.push(totalPages);
        }
    
        return items;
      };
    
      const [isFetching, setIsFetching] = useState(false);
    
      const handleFetchedReviewsDetails = async (page: number) => {
        if (isFetching) {
          return;
        }
        setIsFetching(true);
        const newReviews = await fetch(`/api/admin/reviews?page=${page}`);
        if (newReviews.ok) {
          newReviews.json().then((data) => {
            setFetchedReviewDetails({
              Reviews: data.AllReviews,
              totalReview: data.totalReviews,
              page: page,
            });
            setIsFetching(false);
          });
        } else {
          setFetchedReviewDetails((prev) => prev);
          toast.error("Error fetching data.", {
            position: "top-right",
          });
          setIsFetching(false);
        }
      };
    
      const paginationItems = getPaginationItems();

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Reviews
        </h1>
        <Select value={filterBy} onValueChange={setFilterBy}>
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
      </CardHeader>
      <CardContent className="space-y-6">
        {Reviews?.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <SearchSlash />
              </EmptyMedia>
              <EmptyTitle>Nothing here!</EmptyTitle>
              <EmptyDescription>
                You haven't Received any reviews recently.
              </EmptyDescription>
              <Button
                variant="link"
                asChild
                className="text-muted-foreground"
                size="sm"
              >
              </Button>
            </EmptyHeader>
          </Empty>
        ) : (
          Reviews?.map((review) => <ReviewCard review={review} />)
        )}
      </CardContent>
      <CardFooter>
        <Pagination className="py-5 mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handleFetchedReviewsDetails(page - 1)}
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
                    onClick={() => handleFetchedReviewsDetails(page)}
                    isActive={item === page}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handleFetchedReviewsDetails(page + 1)}
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

export default ReviewList
