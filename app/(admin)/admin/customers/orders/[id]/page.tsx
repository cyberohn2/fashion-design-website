import { getCustomerOrders } from "@/actions/admin/order/get-customer-orders";
import { OrderTable } from "@/components/admin-components/order/order-table";


const page = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const param = await params;
  const orders = await getCustomerOrders({
    pagination: { page: 1 },
    userId: param.id,
  });

  return (
      <main className="@container/main flex flex-1 flex-col gap-2 px-6">
        <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
              Orders by {orders.username || "Customer"}
            </h1>
          </div>
          <OrderTable orders={orders.AllOrders} totalOrder={orders.totalOrders} page={orders.page} />
        </div>
      </main>
    );
};

export default page
