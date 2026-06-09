import { getAddresses } from "@/actions/addresses/get-addresses";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const addresses = await getAddresses();
        if(!addresses) {
            return NextResponse.json({}, { status: 200 });
        }

        return NextResponse.json(addresses, {status: 200});
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching addresses:", message);
        return NextResponse.json(
            { error: "Failed to fetch addresses" },
            { status: 500 },
        );
    }
}