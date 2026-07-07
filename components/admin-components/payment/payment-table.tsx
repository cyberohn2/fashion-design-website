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
import { ReusablePagination } from "@/components/ui/reusable-pagination";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";

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
  const totalPages = Math.ceil(fetchedPayments.totalPayment / ITEMS_PER_PAGE);
  const paginationItems = getPaginationItems(fetchedPayments.page, totalPages);

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
          Payments: data.formattedPayment,
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

  // search fn
  const [searchTerm, setSearchTerm] = useState<string>();
  const [showSearch, setShowSearch] = useState<string>("");
  const handleSearch = async (page?: number) => {
    if (isFetching) {
      return;
    }
    if (!searchTerm) {
      return
    }
    setIsFetching(true);
    const searchResult = await fetch(`/api/admin/payment/search`, {
      method: "POST",
      body: JSON.stringify({ searchTerm, page: page || 1 }),
    });
    if (searchResult.ok) {
      searchResult.json().then((data) => {
        setFetchedPayments({
          Payments: data.payment.formattedPayment,
          totalPayment: data.payment.totalPayment,
          page: data.payment.page,
        });
        setShowSearch(`Showing Results For ${searchTerm}`);
        setIsFetching(false);
      });
    } else {
      setFetchedPayments((prev) => prev);
      toast.error("Error fetching payments.", {
        position: "top-right",
      });
      setIsFetching(false);
    }
  };

  return (
    <Card className="@container/card min-h-full!">
      <CardHeader className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Payments
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
                placeholder="Payment reference..."
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
        </div>
      </CardHeader>
      <CardContent>
        <p>{showSearch}</p>
        <Table>
          <TableCaption>A list of All your Payments.</TableCaption>
          <TableHeader>
            <TableRow className="font-bold">
              <TableHead className="w-25 font-bold">Payment Reference</TableHead>
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
                    {Payment.Provider_Reference}
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
        <ReusablePagination
          className="py-5 mt-auto"
          page={fetchedPayments.page}
          totalPages={totalPages}
          paginationItems={paginationItems}
          onPageChange={
            searchTerm
              ? (page) => handleSearch(page)
              : (page) => handleFetchedPaymentsDetails(page)
          }
        />
      </CardFooter>
    </Card>
  );
}
