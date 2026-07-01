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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useMemo, useState } from "react";
import Link from "next/link";
import { paymentStatusColorMap, statusColorMap } from "./order-details";
import { Badge } from "../../ui/badge";
import { userOrder } from "@/app/(customer)/order-history/page";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { getPaginationItems } from "@/lib/getPaginationItems";
import { orderStatus } from "@/lib/lib";

export function OrderTable({orders, totalOrder, page}:{orders: userOrder[], totalOrder: number, page: number}) {
  const [fetchedOrderDetails, setFetchedOrderDetails] = useState({orders, totalOrder, page})

  // filter fn
  const [filters, setFilters] = useState<string[]>([]);
  const toggleFilter = (value: string) => {
    setFilters((prev) =>
      prev.includes(value)
        ? prev.filter((item) => item !== value)
        : [...prev, value],
    );
  };
  const filteredOrders = useMemo(() => {
    if (filters.length === 0) {
      return fetchedOrderDetails.orders;
    }

    return fetchedOrderDetails.orders.filter(
      (order) =>
        filters.includes(order.status) || filters.includes(order.order_type),
    );
  }, [fetchedOrderDetails.orders, filters]);

  // pagination fn
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(fetchedOrderDetails.totalOrder / ITEMS_PER_PAGE);
  const paginationItems = getPaginationItems(
    fetchedOrderDetails.page,
    totalPages,
  );

  // fetch new page data fn
  const [isFetching, setIsFetching] = useState(false);
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
            page: data.page,
          });
          setIsFetching(false)}
          );
      }else{
          setFetchedOrderDetails(prev => prev)
          toast.error("Error fetching orders.", {
            position: "top-right",
          });
          setIsFetching(false)
      }
  }

  return (
    <Card className="@container/card min-h-full!">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Orders
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filters {filters.length > 0 && `(${filters.length})`}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Order Status</DropdownMenuLabel>
            {orderStatus.map((status, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={filters.includes(status)}
                onCheckedChange={() => toggleFilter(status)}
              >
                {status.toLowerCase().replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Order Type</DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={filters.includes("READY_MADE")}
              onCheckedChange={() => toggleFilter("READY_MADE")}
            >
              Ready Made
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={filters.includes("SEMI_CUSTOM")}
              onCheckedChange={() => toggleFilter("SEMI_CUSTOM")}
            >
              Semi Custom
            </DropdownMenuCheckboxItem>

            <DropdownMenuCheckboxItem
              checked={filters.includes("FULL_CUSTOM")}
              onCheckedChange={() => toggleFilter("FULL_CUSTOM")}
            >
              Full Custom
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  You do not have any orders yet!
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
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
                    ₦{order.total || 0}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button>
                      <Link href={`/admin/orders/${order.order_number}`}>
                        View
                      </Link>
                    </Button>
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
