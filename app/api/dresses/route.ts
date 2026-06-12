import { getDresses } from "@/actions/dresses/get-dresses";
import { NextResponse } from "next/server";

export async function GET() {
    try{
        const dresses = await getDresses({});
        if (!dresses) {
          return NextResponse.json({}, { status: 200 });
        }

        return NextResponse.json(dresses, { status: 200 });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error fetching dresses:", message);
        return NextResponse.json(
            { error: "Failed to fetch dresses" },
            { status: 500 },
        );
    }
}