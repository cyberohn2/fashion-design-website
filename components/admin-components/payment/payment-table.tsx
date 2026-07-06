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
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { useMemo, useState } from "react";
import Link from "next/link";
import { DeliveryMethod, OrderStatus, OrderType, type Payment, PaymentStatus, paymentStatusColorMap, statusColorMap } from "../order/order-details";
import { Badge } from "../../ui/badge";
import { formatDate } from "@/lib/format-table";
import { toast } from "sonner";
import { getPaginationItems } from "@/lib/getPaginationItems";
import { Button } from "@/components/ui/button";
import { paymentStatus } from "@/lib/lib";

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
  const [fetchedPayments, setFetchedPayments] = useState({
    Payments,
    totalPayment,
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
  const filteredPayments = useMemo(() => {
    if (filters.length === 0) {
      return fetchedPayments.Payments;
    }

    return fetchedPayments.Payments.filter((payment) =>
      filters.includes(payment.status),
    );
  }, [fetchedPayments.Payments, filters]);

  // pagination fn
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(
    fetchedPayments.totalPayment / ITEMS_PER_PAGE,
  );
  const paginationItems = getPaginationItems(
    fetchedPayments.page,
    totalPages,
  );


  // function to fetch more pages
  const [isFetching, setIsFetching] = useState(false);
  const handleFetchedPaymentsDetails = async (page: number) => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    const newPayments = await fetch(`/api/admin/payments?page=${page}`);
    if (newPayments.ok) {
      newPayments.json().then((data) => {
        setFetchedPayments({
          Payments: data.AllPayments,
          totalPayment: data.totalPayments,
          page: data.page,
        });
        setIsFetching(false);
      });
    } else {
      setFetchedPayments((prev) => prev);
      setIsFetching(false);
      toast.error("Error fetching payments.", {
        position: "top-right",
      });
    }
  };

  return (
    <Card className="@container/card min-h-full!">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Payments
        </h1>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Filters {filters.length > 0 && `(${filters.length})`}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Payment Status</DropdownMenuLabel>
            {paymentStatus.map((status, index) => (
              <DropdownMenuCheckboxItem
                key={index}
                checked={filters.includes(status)}
                onCheckedChange={() => toggleFilter(status)}
              >
                {status.toLowerCase().replace(/_/g, " ")}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
            {filteredPayments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  You do not have any payments yet!
                </TableCell>
              </TableRow>
            ) : (
              filteredPayments.map((Payment) => (
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
                onClick={() => fetchedPayments.page > 1 && handleFetchedPaymentsDetails(fetchedPayments.page - 1)}
                aria-disabled={fetchedPayments.page === 1}
                className={fetchedPayments.page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {paginationItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handleFetchedPaymentsDetails(fetchedPayments.page)}
                    isActive={item === fetchedPayments.page}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handleFetchedPaymentsDetails(fetchedPayments.page + 1)}
                aria-disabled={fetchedPayments.page === totalPages}
                className={
                  fetchedPayments.page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardFooter>
    </Card>
  );
}
