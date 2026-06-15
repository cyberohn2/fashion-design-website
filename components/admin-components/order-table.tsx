"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { orders } from "@/app/(customer)/order-history/page";
import { useState } from "react";

export function OrderTable({orders, totalOrder, page}:{orders: orders[], totalOrder: number, page: number}) {
    const [fetchedOrderDetails, setFetchedOrderDetails] = useState({orders, totalOrder, page})

    const ITEMS_PER_PAGE = 20;

    const totalPages = Math.ceil(fetchedOrderDetails.totalOrder / ITEMS_PER_PAGE);

    const getPaginationItems = () => {
      const items: (number | "ellipsis")[] = [];

      // Always show first page
      items.push(1);

      // Left ellipsis
      if (fetchedOrderDetails.page > 3) {
        items.push("ellipsis");
      }

      // Pages around current page
      for (
        let i = Math.max(2, fetchedOrderDetails.page - 1);
        i <= Math.min(totalPages - 1, fetchedOrderDetails.page + 1);
        i++
      ) {
        items.push(i);
      }

      // Right ellipsis
      if (fetchedOrderDetails.page < totalPages - 2) {
        items.push("ellipsis");
      }

      // Always show last page
      if (totalPages > 1) {
        items.push(totalPages);
      }

      return items;
    };

    const [isFetching, setIsFetching] = useState(false)

    const handleFetchedOrdersDetails = async (page: number) => {
        if (isFetching) {
            return
        }
        setIsFetching(true)
        const newOrders = await fetch(`/api/admin/orders?page=${page}`)
        if (newOrders.ok) {
            newOrders
            .json()
            .then((data) =>
            {setFetchedOrderDetails({
                orders: data.AllOrders,
                totalOrder: data.totalOrders,
                page: page
            })
            setIsFetching(false)}
            );
        }else{
            setFetchedOrderDetails(prev => prev)
            setIsFetching(false)
        }
    }

    const paginationItems = getPaginationItems();

  return (
    <Card className="@container/card">
      <CardHeader>Orders</CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of All your orders.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Number</TableHead>
              <TableHead className="text-center">Type</TableHead>
              <TableHead className="text-right">Status</TableHead>
              <TableHead className="text-right">Payment Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchedOrderDetails.orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">
                  {order.order_number}
                </TableCell>
                <TableCell className="text-center">
                  {order.order_type}
                </TableCell>
                <TableCell className="text-right">{order.status}</TableCell>
                <TableCell className="text-right">
                  {order.payment?.status}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{totalOrder}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination className="py-5 mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handleFetchedOrdersDetails(page - 1)}
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
                    onClick={() => handleFetchedOrdersDetails(page)}
                    isActive={item === page}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handleFetchedOrdersDetails(page + 1)}
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
