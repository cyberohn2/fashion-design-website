import { getCustomer } from "@/actions/admin/customer/get-customer"
import { CustomerDetails } from "@/components/admin-components/customer/customer-details";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const param = await params;
  const customer = await getCustomer(param.id);
  if (!customer) {
    return <p>User not found</p>
  }
  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <CustomerDetails user={customer} />
      </div>
    </main>
  );
};

export default page
