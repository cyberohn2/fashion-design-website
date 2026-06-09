import { updateMeasurement } from "@/actions/measurements/update-measurement";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const { measurementId, ...data } = await request.json();
    if (!measurementId) {
      return NextResponse.json(
        { error: "Measurement ID is required" },
        { status: 400 },
      );
    }

    try{
        const updatedMeasurement = await updateMeasurement({
          measurementId,
          ...data,
        });
        if(!updatedMeasurement) {
            return NextResponse.json({ error: "Measurement not found" }, { status: 404 });
        }
        return NextResponse.json(updatedMeasurement, {status: 201});
    }
    catch (error) { 
        const message = error instanceof Error ? error.message : String(error);
        console.error("Error updating Measurement:", message);
        return NextResponse.json({ error: "Failed to update Measurement" }, { status: 500 });
    }

}