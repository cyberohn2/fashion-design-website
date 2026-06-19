import { getDresses } from '@/actions/admin/get-dresses';
import DressList from '@/components/admin-components/product/dress-list';

const page = async () => {
    const dresses = await getDresses({ pagination: { page: 1 } });

  return (
    <div>
      <main className="@container/main flex flex-1 flex-col gap-2 px-6">
            <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
              <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
                  Dresses
                </h1>
              </div>
              <DressList Dresses={dresses?.dresses} totalDress={dresses?.totalDress as number} page={1} />
            </div>
          </main>
    </div>
  )
}

export default page
