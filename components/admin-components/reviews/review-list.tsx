"use client"
import { useMemo, useState } from 'react'
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
import { getPaginationItems } from '@/lib/getPaginationItems';
import { ReusablePagination } from '@/components/ui/reusable-pagination';

const ReviewList = ({
  Reviews,
  totalReview,
  page,
}: {
  Reviews?: Review[];
  totalReview: number;
  page: number;
}) => {

  const [fetchedReviews, setFetchedReviews] = useState({
    Reviews,
    totalReview,
    page,
  });

  // sort fn
  const [sortBy, setSortBy] = useState<string>();
  const sortedReviews = useMemo(() => {
    if (sortBy === "relevance") return fetchedReviews.Reviews;

    const sorted = fetchedReviews.Reviews && [...fetchedReviews.Reviews];

    switch (sortBy) {
      case "rating-low":
        return sorted?.sort((a, b) => a.rating - b.rating);

      case "rating-high":
        return sorted?.sort((a, b) => b.rating - a.rating);

      default:
        return fetchedReviews.Reviews;
    }
  }, [fetchedReviews.Reviews, sortBy]);

  // pagination fn
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(
    fetchedReviews.totalReview / ITEMS_PER_PAGE,
  );
  const paginationItems = getPaginationItems(fetchedReviews.page, totalPages);

  // fetch new page data fn
  const [isFetching, setIsFetching] = useState(false);
  const handleFetchedReviewsDetails = async (page: number) => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    const newReviews = await fetch(`/api/admin/reviews?page=${page}`);
    if (newReviews.ok) {
      newReviews.json().then((data) => {
        setFetchedReviews({
          Reviews: data.AllReviews,
          totalReview: data.totalReviews,
          page: data.page,
        });
        setIsFetching(false);
      });
    } else {
      setFetchedReviews((prev) => prev);
      toast.error("Error fetching data.", {
        position: "top-right",
      });
      setIsFetching(false);
    }
  };

  return (
    <Card className="p-0! border-none! shadow-none!">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Reviews
        </h1>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="">
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent className="z-10 bg-card rounded-sm shadow">
            <SelectGroup>
              <SelectLabel>Sort By</SelectLabel>
              <SelectItem value="relevance">Relevant</SelectItem>
              <SelectItem value="price-low">Rating: Low </SelectItem>
              <SelectItem value="price-high">Rating: High</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        {sortedReviews?.length === 0 ? (
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
              ></Button>
            </EmptyHeader>
          </Empty>
        ) : (
          sortedReviews?.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        )}
      </CardContent>
      <CardFooter>
        <ReusablePagination
          className="py-5 mt-auto"
          page={fetchedReviews.page}
          totalPages={totalPages}
          paginationItems={paginationItems}
          onPageChange={handleFetchedReviewsDetails}
        />
      </CardFooter>
    </Card>
  );
}

export default ReviewList
