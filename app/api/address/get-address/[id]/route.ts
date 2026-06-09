import { NextResponse } from "next/server";
import { getAddress } from "@/actions/addresses/get-address";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const param = await params;
    if (!param.id) {
      return NextResponse.json(
        { error: "Address ID is required" },
        { status: 400 },
      );
    }

    const address = await getAddress(param.id);
    if (!address) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    return NextResponse.json(address, {status: 200});
  } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching address:", message);
        return NextResponse.json(
            { error: "Failed to fetch address" },
            { status: 500 },
        );
    }
}
