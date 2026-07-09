import { getDresses } from "@/actions/admin/dress/get-dresses";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") ?? 1;

  try {
    const dresses = await getDresses({ pagination: { page: Number(page) } });

    return NextResponse.json(dresses, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error fetching dresses:", message);
    return NextResponse.json(
      { error: "Failed to fetch dresses" },
      { status: 500 },
    );
  }
}
