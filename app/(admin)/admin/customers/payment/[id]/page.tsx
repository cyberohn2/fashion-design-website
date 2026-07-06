import { getCustomerPayments } from "@/actions/admin/get-customer-payments";
import { getPayments } from "@/actions/admin/get-payment";
import { PaymentTable } from "@/components/admin-components/payment/payment-table";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const param = await params;
  const payments = await getCustomerPayments({ pagination: { page: 1 }, userId: param.id });

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
            All Payments by {payments.username || "Customer"}
          </h1>
        </div>
        <PaymentTable
          Payments={payments.AllPayments}
          totalPayment={payments.totalPayments}
          page={payments.page}
        />
      </div>
    </main>
  );
};

export default page;
