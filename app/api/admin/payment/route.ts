import { getPayments } from "@/actions/admin/get-payment";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url)
    const page = searchParams.get("page") ?? 1

  try {
    const payment =  await getPayments({pagination: {page: Number(page)}})

    return NextResponse.json(payment, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching payments:", message);
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 },
    );
  }
}
