import { getCustomers } from "@/actions/admin/customer/get-customers";
import { CustomerTable } from "@/components/admin-components/customer/customer-table";

const page = async () => {
  const customers = await getCustomers({ pagination: { page: 1 } });

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <CustomerTable
          customers={customers.fetchedCustomers}
          totalCustomers={customers.totalCustomer}
          page={customers.page}
        />
      </div>
    </main>
  );
};

export default page;
