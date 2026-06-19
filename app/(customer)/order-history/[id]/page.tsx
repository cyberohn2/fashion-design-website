import { getOrder } from "@/actions/orders/get-order";
import OrderSummary from "@/components/app-components/order/order-summary";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const param = await params;
  const order = await getOrder(param.id);

  return (
    <main className="pt-34 md:pt-24 container mx-auto px-4 min-h-screen">
      <OrderSummary order={order} />
    </main>
  );
}

export default page
