import { getOverview } from "@/actions/admin/get-overview";
import { getPayments } from "@/actions/payments/get-payment";
import { CustomerTable } from "@/components/app-components/customer-table";
import { RevenueChart } from "@/components/app-components/revenue-chart";
import SectionCards from "@/components/app-components/section-card";

const page = async () => {
  try {
    const dashboardOverview = await getOverview();
    const payments = await getPayments()

    return (
      <main className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards overViewData={dashboardOverview} />
            <div className="px-4 lg:px-6 space-y-6">
              <RevenueChart chartData={payments} />
              <CustomerTable />
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    
  }
  
}

export default page
