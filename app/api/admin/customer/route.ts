import { getCustomers } from "@/actions/admin/get-customers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const {searchParams} = new URL(req.url)
    const page = searchParams.get("page") ?? 1

  try {
    const customers =  await getCustomers({pagination: {page: Number(page)}})

    return NextResponse.json(customers, { status: 200 });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching customers:", message);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 },
    );
  }
}
