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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { usePathname } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";

type customer = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  full_name: string;
  phone: string;
  role: "USER" | "ADMIN";
}

export function CustomerTable({customers, totalCustomers, page}:{customers: customer[], totalCustomers: number, page: number}) {
  const pathname = usePathname()

  const [fetchedCustomers, setFetchedCustomers] = useState({
    customers,
    totalCustomers,
    page,
  });
  const [filterBy, setFilterBy] = useState<string>();

  const ITEMS_PER_PAGE = 20;

  const totalPages = Math.ceil(
    fetchedCustomers.totalCustomers / ITEMS_PER_PAGE,
  );

  const getPaginationItems = () => {
    const items: (number | "ellipsis")[] = [];

    // Always show first page
    items.push(1);

    // Left ellipsis
    if (fetchedCustomers.page > 3) {
      items.push("ellipsis");
    }

    // Pages around current page
    for (
      let i = Math.max(2, fetchedCustomers.page - 1);
      i <= Math.min(totalPages - 1, fetchedCustomers.page + 1);
      i++
    ) {
      items.push(i);
    }

    // Right ellipsis
    if (fetchedCustomers.page < totalPages - 2) {
      items.push("ellipsis");
    }

    // Always show last page
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  };

  const [isFetching, setIsFetching] = useState(false);

  const handleFetchedCustomers = async (page: number) => {
    if (isFetching) {
      return;
    }
    setIsFetching(true);
    const newCustomers = await fetch(`/api/admin/customer?page=${page}`);
    if (newCustomers.ok) {
      newCustomers.json().then((data) => {
        setFetchedCustomers({
          customers: data.AllCustomer,
          totalCustomers: data.totalCustomers,
          page: page,
        });
        setIsFetching(false);
      });
    } else {
      setFetchedCustomers((prev) => prev);
      setIsFetching(false);
    }
  };

  const paginationItems = getPaginationItems();

  return (
    <Card className="@container/card">
      <CardHeader>Customers</CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            A list of New Customers in the last 30 days.
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-25">Name</TableHead>
              <TableHead className="text-center">Email</TableHead>
              <TableHead className="text-right">Phone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-medium">
                  {customer.full_name}
                </TableCell>
                <TableCell className="text-center">{customer.email}</TableCell>
                <TableCell className="text-right">{customer.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {customers.length} customers
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
      {pathname.includes("/admin/customers") && (
        <CardFooter>
          <Pagination className="py-5 mt-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handleFetchedCustomers(page - 1)}
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
                      onClick={() => handleFetchedCustomers(page)}
                      isActive={item === page}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handleFetchedCustomers(page + 1)}
                  aria-disabled={page === totalPages}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
