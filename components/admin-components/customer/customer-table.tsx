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
import { useState } from "react";
import Link from "next/link";
import { getPaginationItems } from "@/lib/getPaginationItems";
import { ReusablePagination } from "@/components/ui/reusable-pagination";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { SearchIcon, XIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export type customer = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  full_name: string;
  phone: string;
  role: "USER" | "ADMIN";
}

export function CustomerTable({
  customers,
  totalCustomers,
  page,
}: {
  customers: customer[];
  totalCustomers: number;
  page: number;
}) {
  const pathname = usePathname();

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

  // search fn
  const [searchTerm, setSearchTerm] = useState<string>();
  const [showSearch, setShowSearch] = useState<string>();
  const handleSearch = async (page?: number) => {
    if (isFetching) {
      return;
    }
    if (!searchTerm) {
      return;
    }
    setIsFetching(true);
    const searchResult = await fetch(`/api/admin/customer/search`, {
      method: "POST",
      body: JSON.stringify({ searchTerm, page: page || 1 }),
    });
    if (searchResult.ok) {
      searchResult.json().then((data) => {
        setFetchedCustomers({
          customers: data.AllCustomer,
          totalCustomers: data.totalCustomers,
          page: data.page,
        });
        setShowSearch(`Showing Results For ${searchTerm}`);
        setIsFetching(false);
      });
    } else {
      setFetchedCustomers((prev) => prev);
      toast.error("Error fetching customers.", {
        position: "top-right",
      });
      setIsFetching(false);
    }
  };

  return (
    <Card className="@container/card">
      <CardHeader>
        <h1 className="text-xl md:text-2xl font-bold tracking-tighter">
          Customers
        </h1>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }} className=" flex gap-2">
          <InputGroup className={`rounded-full flex}`}>
            <InputGroupInput
              className="placeholder:text-white/80 min-w-10! placeholder:hidden "
              placeholder="Search by Order number..."
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
      </CardHeader>
      <CardContent>
        <p>{showSearch}</p>
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
            {fetchedCustomers.customers.length === 0 ? (
              <TableRow>
                <TableCell className="text-center" colSpan={4}>
                  No customers yet!
                </TableCell>
              </TableRow>
            ) : (
              fetchedCustomers.customers.map((customer) => (
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
          <ReusablePagination
            className="py-5 mt-auto"
            page={fetchedCustomers.page}
            totalPages={totalPages}
            paginationItems={paginationItems}
            onPageChange={
              searchTerm
                ? (page) => handleSearch(page)
                : (page) => handleFetchedCustomers(page)
            }
          />
        </CardFooter>
      )}
    </Card>
  );
}
