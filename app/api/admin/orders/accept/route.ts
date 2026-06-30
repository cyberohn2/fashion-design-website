import { acceptOrder } from "@/actions/admin/accept-order";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { orderId, status, adminAmount } = await req.json();
    if (!orderId || !status) {
        return NextResponse.json(
          { error: "order id and status required" },
          { status: 400 },
        );
    }

    try {
        const updatedOrder = await acceptOrder({
          orderId,
          status,
          adminAmount,
        });
        return NextResponse.json(updatedOrder, { status: 201 });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
        return NextResponse.json(
          { error: message },
          { status: 500 },
        );
    }
}
