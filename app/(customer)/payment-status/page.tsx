import { PaymentStatusCard, PaymentStatusCardProp } from "@/components/app-components/payment/status";

const page = async ({searchParams}: {searchParams: Promise<{reference?: string;}>;}) => {
    const { reference } = await searchParams

    let status: PaymentStatusCardProp = "pending";
    const req = await fetch(`/api/payment/verify?reference=${reference}`)
    if(req.ok){
        const data = await req.json()
        status = data.data
    } 

  return (
        <main className="py-24 pt-34 md:pt-24 container mx-auto">
            <div className="w-full max-w-sm md:max-w-4xl mx-auto">
                <PaymentStatusCard status={status} />
            </div>
        </main>
    );
};

export default page
