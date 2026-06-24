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
import { DeliveryMethod, OrderStatus, OrderType, type Payment, PaymentStatus, paymentStatusColorMap, statusColorMap } from "../order/order-details";
import { Badge } from "../../ui/badge";
import { formatDate } from "@/lib/format-table";

export type paymentTableProp = Payment & {
  order: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    status: OrderStatus;
    userId: string;
    order_number: string;
    order_type: OrderType;
    payment_status: PaymentStatus;
    delivery_method: DeliveryMethod;
    delivery_address_id: string;
    estimated_delivery: Date | null;
    notes: string | null;
    total: number;
  }
};

export function PaymentTable({
  Payments,
  totalPayment,
  page,
}: {
  Payments: paymentTableProp[];
  totalPayment: number;
  page: number;
}) {
  const [fetchedPaymentDetails, setFetchedPaymentDetails] = useState({
    Payments,
    totalPayment,
    page,
  });
  const [filterBy, setFilterBy] = useState<string>();

  const ITEMS_PER_PAGE = 20;

  const totalPages = Math.ceil(
    fetchedPaymentDetails.totalPayment / ITEMS_PER_PAGE,
  );

  const getPaginationItems = () => {
    const items: (number | "ellipsis")[] = [];

    // Always show first page
    items.push(1);

    // Left ellipsis
    if (fetchedPaymentDetails.page > 3) {
      items.push("ellipsis");
    }

    // Pages around current page
    for (
      let i = Math.max(2, fetchedPaymentDetails.page - 1);
      i <= Math.min(totalPages - 1, fetchedPaymentDetails.page + 1);
      i++
    ) {
      items.push(i);
    }

    // Right ellipsis
    if (fetchedPaymentDetails.page < totalPages - 2) {
      items.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const [isFetching, setIsFetching] = useState(false);

  const handleFetchedPaymentsDetails = async (page: number) => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    const newPayments = await fetch(`/api/admin/payments?page=${page}`);
    if (newPayments.ok) {
      newPayments.json().then((data) => {
        setFetchedPaymentDetails({
          Payments: data.AllPayments,
          totalPayment: data.totalPayments,
          page: page,
        });
        setIsFetching(false);
      });
    } else {
      setFetchedPaymentDetails((prev) => prev);
      setIsFetching(false);
    }
  };

  const paginationItems = getPaginationItems();

  return (
    <Card className="@container/card min-h-full">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Payments
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
          <TableCaption>A list of All your Payments.</TableCaption>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="w-25 font-bold">Order Number</TableHead>
              <TableHead className="text-center font-bold">
                Payment Status
              </TableHead>
              <TableHead className="text-center font-bold">Paid At</TableHead>
              <TableHead className="text-center font-bold">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fetchedPaymentDetails.Payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  You do not have any payments yet!
                </TableCell>
              </TableRow>
            ) : (
              fetchedPaymentDetails.Payments.map((Payment) => (
                <TableRow key={Payment.id}>
                  <TableCell className="font-medium">
                    {Payment.order.order_number}
                  </TableCell>
                  <TableCell className={`text-center capitalize`}>
                    <Badge className={paymentStatusColorMap[Payment?.status]}>
                      {Payment.status.toLowerCase().replace(/_/g, " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center capitalize">
                    {formatDate(Payment.paidAt)}
                  </TableCell>
                  <TableCell>₦{Payment.amount}</TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/orders/${Payment.order.order_number}`}>
                      View Order
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{totalPayment}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      <CardFooter>
        <Pagination className="py-5 mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handleFetchedPaymentsDetails(page - 1)}
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
                    onClick={() => handleFetchedPaymentsDetails(page)}
                    isActive={item === page}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handleFetchedPaymentsDetails(page + 1)}
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
