import { CreateFullCustomOrderData } from "@/actions/orders/create-full-custom-order";
import { getUserOrders } from "@/actions/orders/get-user-orders";
import OrderHistory from "@/components/app-components/order/order-history";

export type orders = {
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
  delivery_method: "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";
  delivery_address_id: string;
  estimated_delivery: Date | null;
  notes: string | null;
  total: number;
  payment: Payment | null;
  items?: Order_Items[];
  custom_order?: CreateFullCustomOrderData & {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
    admin_final_price: number;
  } | null;
};

export type Order_Items = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    orderId: string;
    dressId: string;
    quantity: number;
    price: number;
}

export type Payment = {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    paidAt: Date;
    orderId: string;
    Provider: string;
    Provider_Reference: string;
    amount: number;
    status: 
        | "UNPAID"
        | "PARTIALLY_PAID"
        | "PAID"
        | "REFUNDED"
        | "FAILED"
        | "PENDING"
        | "SUCCESS"
    ;
}
const page = async () => {
    try {
        const orders: orders[] | undefined = await getUserOrders();
        return (
          <main className="pt-34 md:pt-24">
            <OrderHistory orders={orders} />
          </main>
        );
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.log(message);
    }

}

export default page
