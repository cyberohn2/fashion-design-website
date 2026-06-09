import { getMeasurements } from '@/actions/measurements/get-measurements';
import ManageMeasurements, { measurement } from '@/components/app-components/manage-measurements'

const page = async () => {
    const measurements: measurement[] = await getMeasurements();

  return (
    <main className="py-24 pt-34 md:pt-24">
      <ManageMeasurements measurements={measurements} />
    </main>
  );
}

export default page
