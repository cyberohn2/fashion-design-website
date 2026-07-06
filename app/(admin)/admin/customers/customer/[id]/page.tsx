import { getCustomer } from "@/actions/admin/get-customer"
import { CustomerDetails } from "@/components/admin-components/customer/customer-details";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const param = await params;
  const customer = await getCustomer(param.id);
  if (!customer) {
    return <p>User not found</p>
  }
  return (
    <CustomerDetails user={customer} />
    );
};

export default page
