import { getOrderDetails } from "@/actions/admin/order/get-order-details"
import { OrderDetails } from "@/components/admin-components/order/order-details";

const page = async ({ params }: { params: Promise<{ order_number: string }> }) => {
  const param = await params;
  const orderDetails = await getOrderDetails(param.order_number);
  if(!orderDetails){
    return (
      <main className="@container/main flex flex-1 flex-col gap-2 px-6">
        <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
          <p>Order not found</p>
        </div>
      </main>
    );
  }

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <OrderDetails order={orderDetails} />
      </div>
    </main>
  );
};

export default page
