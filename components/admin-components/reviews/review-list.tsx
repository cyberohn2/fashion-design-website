import React, { useState } from 'react'
import ReviewCard, { Review } from './review-card';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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
          setIsFetching(false);
        }
      };
    
      const paginationItems = getPaginationItems();

  return (
    <Card>
        <CardContent className='space-y-6'>
            {Reviews?.map(review => (
                <ReviewCard review={review} />
            ))}            
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
