import { getMeasurements } from '@/actions/measurements/get-measurements';
import ManageMeasurements, { measurement } from '@/components/app-components/manage-measurements'

const page = async () => {
  let measurements: measurement[];
  try {
    measurements = await getMeasurements();
    return (
      <main className="pt-34 md:pt-24">
        <ManageMeasurements measurements={measurements} />
      </main>
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
  }
}

export default page
