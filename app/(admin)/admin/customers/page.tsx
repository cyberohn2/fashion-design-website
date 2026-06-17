import { getCustomers } from "@/actions/admin/get-customers";
import { CustomerTable } from "@/components/admin-components/dashboard/customer-table";


const page = async () => {
    const customers = await getCustomers({ pagination: { page: 1 } });

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
            Customers
          </h1>
        </div>
        <CustomerTable
          customers={customers.fetchedCustomers}
          totalCustomers={customers.totalCustomer}
          page={1}
        />
      </div>
    </main>
  );
}

export default page
