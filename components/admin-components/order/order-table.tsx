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
import {
  Select,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useState } from "react";
import Link from "next/link";
import { paymentStatusColorMap, statusColorMap } from "./order-details";
import { Badge } from "../../ui/badge";
import { userOrder } from "@/app/(customer)/order-history/page";

export function OrderTable({orders, totalOrder, page}:{orders: userOrder[], totalOrder: number, page: number}) {
    const [fetchedOrderDetails, setFetchedOrderDetails] = useState({orders, totalOrder, page})
    const [filterBy, setFilterBy] = useState<string>()

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
    <Card className="@container/card min-h-full">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Orders
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
      <CardContent>
        <Table>
          <TableCaption>A list of All your orders.</TableCaption>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="w-25 font-bold">Number</TableHead>
              <TableHead className="text-center font-bold">Type</TableHead>
              <TableHead className="text-center font-bold">Status</TableHead>
              <TableHead className="text-center font-bold">
                Payment Status
              </TableHead>
              <TableHead className="text-center font-bold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchedOrderDetails.orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">You do not have any orders yet!</TableCell>
              </TableRow>
            ) : (
              fetchedOrderDetails.orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">
                    {order.order_number}
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    {order.order_type.toLowerCase().replace(/_/g, " ")}
                  </TableCell>
                  <TableCell className={`text-center capitalize`}>
                    <Badge className={statusColorMap[order?.status]}>
                      {order.status.toLowerCase().replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    <Badge
                      className={paymentStatusColorMap[order?.payment_status]}
                    >
                      {order.payment_status.toLowerCase().replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    ₦{order.total || order.payment?.amount || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${order.order_number}`}>
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
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
