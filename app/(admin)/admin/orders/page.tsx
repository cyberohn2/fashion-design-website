import { getAllOrders } from "@/actions/admin/get-all-orders";
import { OrderTable } from "@/components/admin-components/order-table";

const page = async () => {
  const orders = await getAllOrders({pagination: {page:1}})

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
            Orders
          </h1>
        </div>
        <OrderTable orders={orders.AllOrders} totalOrder={orders.totalOrders} page={1} />
      </div>
    </main>
  );
}

export default page
