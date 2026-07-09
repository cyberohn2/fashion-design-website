import { confirmCustomOrderPayment } from "@/actions/admin/order/confirm-custom-order-payment";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { orderId } = await req.json();
    if (!orderId ) {
        return NextResponse.json(
          { error: "order id required!" },
          { status: 400 },
        );
    }

    try {
        const updatedOrder = await confirmCustomOrderPayment(orderId)
        return NextResponse.json(updatedOrder, { status: 201 });
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error updating payment status:", message);
        return NextResponse.json(
          { error: "Server Error: couldn't update payment status" },
          { status: 500 },
        );
    }
}
