import { getAllOrders } from "@/actions/admin/order/get-all-orders";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? 1;

  try {
    const orders = await getAllOrders({ pagination: { page: Number(page) } });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching orders:", message);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 },
    );
  }
}
