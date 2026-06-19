"use client"
import { useState } from 'react'
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
import { ProductType } from '@/components/app-components/catalog/product-card';
import DressCard from './dress-card';

const DressList = ({
  Dresses,
  totalDress,
  page,
}: {
  Dresses?: ProductType[];
  totalDress: number;
  page: number;
}) => {

    const [fetchedDressDetails, setFetchedDressDetails] = useState({
        Dresses,
        totalDress,
        page,
      });
      const [filterBy, setFilterBy] = useState<string>();
    
      const ITEMS_PER_PAGE = 20;
    
      const totalPages = Math.ceil(
        fetchedDressDetails.totalDress / ITEMS_PER_PAGE,
      );
    
      const getPaginationItems = () => {
        const items: (number | "ellipsis")[] = [];
    
        // Always show first page
        items.push(1);
    
        // Left ellipsis
        if (fetchedDressDetails.page > 3) {
          items.push("ellipsis");
        }
    
        // Pages around current page
        for (
          let i = Math.max(2, fetchedDressDetails.page - 1);
          i <= Math.min(totalPages - 1, fetchedDressDetails.page + 1);
          i++
        ) {
          items.push(i);
        }
    
        // Right ellipsis
        if (fetchedDressDetails.page < totalPages - 2) {
          items.push("ellipsis");
        }
    
        // Always show last page
        if (totalPages > 1) {
          items.push(totalPages);
        }
    
        return items;
      };
    
      const [isFetching, setIsFetching] = useState(false);
    
      const handleFetchedDressesDetails = async (page: number) => {
        if (isFetching) {
          return;
        }
        setIsFetching(true);
        const newDresses = await fetch(`/api/admin/dress?page=${page}`);
        if (newDresses.ok) {
          newDresses.json().then((data) => {
            setFetchedDressDetails({
              Dresses: data.AllDresses,
              totalDress: data.totalDresses,
              page: page,
            });
            setIsFetching(false);
          });
        } else {
          setFetchedDressDetails((prev) => prev);
          setIsFetching(false);
        }
      };
    
      const paginationItems = getPaginationItems();

  return (
    <Card>
        <CardContent className='space-y-6'>
            {Dresses?.map(dress => (
                <DressCard dress={dress} />
            ))}            
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
