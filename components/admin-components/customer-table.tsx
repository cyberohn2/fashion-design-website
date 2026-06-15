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
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type customer = {
  id: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  full_name: string;
  phone: string;
  role: "USER" | "ADMIN";
}

export function CustomerTable({customers}:{customers: customer[]}) {

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
                <TableCell className="font-medium">{customer.full_name}</TableCell>
                <TableCell className="text-center">{customer.email}</TableCell>
                <TableCell className="text-right">{customer.phone}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">{customers.length} customers</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
}
