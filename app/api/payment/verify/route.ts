import { getPayment } from "@/actions/payments/get-payment";
import { updatePaymentStatus } from "@/actions/payments/update-payment-status";
import { paystack } from "@/lib/paystack";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const reference = searchParams.get("reference");
    if (!reference) {
        return NextResponse.json(
          { error: "Payment reference required!" },
          { status: 400 },
        );
    }

  try {
    const paymentData = await getPayment(reference)
    if (!paymentData) {
      return NextResponse.json(
        { error: "Payment not found!" },
        { status: 400 },
      );
    }

    const res = await paystack.get(`/transaction/verify/${paymentData.Provider_Reference}`);

    if (res.data.data.status === "success" && res.data.data.amount === paymentData.amount) {
      await updatePaymentStatus({
        ref: paymentData.Provider_Reference,
        status: "PAID",
      });
      return NextResponse.json(
        { data: "success" },
        { status: 200 },
      );
    }

    if(res.data.data.status === "failed"){
        return NextResponse.json({ data: "Failed!" }, { status: 200 });
    }

    return NextResponse.json({data: "pending"}, {status: 200})
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Error verifying payment:", message);
    return NextResponse.json(
      { error: "Error verifying payment" },
      { status: 500 },
    );
  }
}
