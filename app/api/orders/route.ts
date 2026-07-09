import { getUserOrders } from "@/actions/orders/get-user-orders";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
        const { searchParams } = new URL(req.url);
        const page = searchParams.get("page") ?? 1;
    try{
        const userOrders = await getUserOrders({pagination: {page: Number(page)}});

        return NextResponse.json(userOrders, { status: 200 });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching user orders:", message);
        return NextResponse.json(
            { error: "Failed to fetch user orders" },
            { status: 500 },
        );
    }
}