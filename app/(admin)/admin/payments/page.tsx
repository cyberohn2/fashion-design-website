import { getPayments } from "@/actions/admin/get-payment";
import { PaymentTable } from "@/components/admin-components/payment/payment-table";

const page = async () => {
  const payments = await getPayments({pagination: {page:1}})

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <PaymentTable Payments={payments.payment.formattedPayment} totalPayment={payments.payment.totalPayment} page={1} />
      </div>
    </main>
  );
}

export default page
