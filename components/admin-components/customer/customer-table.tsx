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
import Link from "next/link";
import { getPaginationItems } from "@/lib/getPaginationItems";

export type customer = {
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

  // pagination fn
  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(
    fetchedCustomers.totalCustomers / ITEMS_PER_PAGE,
  );
  const paginationItems = getPaginationItems(fetchedCustomers.page, totalPages);

  // get next page data fn
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
          page: data.page,
        });
        setIsFetching(false);
      });
    } else {
      setFetchedCustomers((prev) => prev);
      setIsFetching(false);
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Customers
        </h1>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>
            A list of New Customers in the last 30 days.
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-muted-foreground">
              <TableHead className="w-25 font-bold">Name</TableHead>
              <TableHead className="text-center font-bold">Email</TableHead>
              <TableHead className="text-center font-bold">Phone</TableHead>
              <TableHead className="text-right font-bold">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell className="text-center" colSpan={4}>
                  No customers yet!
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">
                    {customer.full_name}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.email}
                  </TableCell>
                  <TableCell className="text-center">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/customers/customer/${customer.id}`}>
                      View Details
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
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
