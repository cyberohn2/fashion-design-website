import { getDresses } from '@/actions/admin/get-dresses';
import DressList from '@/components/admin-components/dress/dress-list';

const page = async () => {
    const dresses = await getDresses({ pagination: { page: 1 } });

  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <DressList Dresses={dresses?.dresses} totalDress={dresses?.totalDress as number} page={1} />
      </div>
    </main>
  )
}

export default page
