import { getUserOrders } from "@/actions/orders/get-user-orders";
import { CustomOrder, OrderItem, OrderStatusHistoryItem, Payment } from "@/components/admin-components/order/order-details";
import OrderHistory from "@/components/app-components/order/order-history";

export type userOrder = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  order_number: string;
  order_type: "READY_MADE" | "SEMI_CUSTOM" | "FULL_CUSTOM";
  status:
    | "PENDING_REVIEW"
    | "ACCEPTED"
    | "REJECTED"
    | "AWAITING_PAYMENT"
    | "PAID"
    | "IN_PRODUCTION"
    | "READY_FOR_DELIVERY"
    | "SHIPPED"
    | "DELIVERED"
    | "COMPLETED"
    | "CANCELLED";
  statusHistory?: OrderStatusHistoryItem[];
  delivery_method: "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";
  delivery_address_id: string;
  estimated_delivery: Date | null;
  notes: string | null;
  total: number;
  payment?: Payment[] | null;
  payment_status:
    | "UNPAID"
    | "PARTIALLY_PAID"
    | "PAID"
    | "REFUNDED"
    | "FAILED"
    | "PENDING"
    | "SUCCESS";
  items?: OrderItem[];
  custom_order?: CustomOrder | null;
};

const page = async () => {
  const orders = await getUserOrders({pagination: {page: 1}});
  return (
    <main className="pt-24">
      <OrderHistory orders={orders.orders} totalOrders={orders.totalOrders} page={orders.page} />
    </main>
  );

}

export default page
