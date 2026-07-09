import { updateOrderStatus } from "@/actions/admin/order/update-order-status";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { orderId, status } = await req.json();
    if (!orderId || !status) {
        return NextResponse.json(
          { error: "order id and status required" },
          { status: 400 },
        );
    }

    try {
        const updatedOrder = await updateOrderStatus({orderId, status})
        return NextResponse.json(updatedOrder, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error updating order status:", message);
        return NextResponse.json(
          { error: "Server Error: couldn't update order status" },
          { status: 500 },
        );
    }
}
