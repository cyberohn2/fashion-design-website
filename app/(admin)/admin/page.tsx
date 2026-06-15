import { getCustomers } from "@/actions/admin/get-customers";
import { getOverview } from "@/actions/admin/get-overview";
import { getPayments } from "@/actions/payments/get-payment";
import { CustomerTable } from "@/components/admin-components/customer-table";
import { RevenueChart } from "@/components/admin-components/revenue-chart";
import SectionCards from "@/components/admin-components/section-card";

const page = async () => {
  try {
    const dashboardOverview = await getOverview();
    const payments = await getPayments()
    const customers = await getCustomers()

    return (
      <main className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
            <SectionCards overViewData={dashboardOverview} />
            <div className="px-4 lg:px-6 space-y-6">
              <RevenueChart chartData={payments} />
              <CustomerTable customers={customers}/>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    
  }
  
}

export default page
