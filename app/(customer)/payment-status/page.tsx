import { getPayment } from "@/actions/payments/get-payment";
import { updatePaymentStatus } from "@/actions/payments/update-payment-status";
import { PaymentStatusCard, PaymentStatusCardProp } from "@/components/app-components/payment/status";
import { paystack } from "@/lib/paystack";

const page = async ({searchParams}: {searchParams: Promise<{reference?: string;}>;}) => {
    const { reference } = await searchParams
    if (!reference) {
        return (<p>No Reference</p>)
    }
    const paymentData = await getPayment(reference)
    if(!paymentData){
        return (<p>Payment Not found</p>)
    }
    const res = await paystack.get(`/transaction/verify/${paymentData.Provider_Reference}`);
    console.log(paymentData.Provider_Reference, res.data)
    if (res.data.data.status === "success" && res.data.data.amount === paymentData.amount) {
        const updatePayment = await updatePaymentStatus({
        ref: paymentData.Provider_Reference,
        status: "PAID",
        });
        return (
            <main className="py-24 pt-34 md:pt-24 container mx-auto">
                <div className="w-full max-w-sm md:max-w-4xl mx-auto">
                    <PaymentStatusCard status={"success"} />
                </div>
            </main>
        ); 
    }
    if(res.data.data.status === "failed"){
        const updatePayment = await updatePaymentStatus({
          ref: paymentData.Provider_Reference,
          status: "FAILED",
        });
        return (
          <main className="py-24 pt-34 md:pt-24 container mx-auto">
            <div className="w-full max-w-sm md:max-w-4xl mx-auto">
              <PaymentStatusCard status={"failed"} />
            </div>
          </main>
        ); 
    }

    return (
        <main className="py-24 pt-34 md:pt-24 container mx-auto">
            <div className="w-full max-w-sm md:max-w-4xl mx-auto">
                <PaymentStatusCard status={"pending"} />
            </div>
        </main>
    );

};

export default page
