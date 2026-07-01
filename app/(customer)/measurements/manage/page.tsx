import { getMeasurements } from '@/actions/measurements/get-measurements';
import ManageMeasurements, {
  measurement,
} from "@/components/app-components/measurement/manage-measurements";

const page = async () => {
  let measurements: measurement[];
  measurements = await getMeasurements();
  return (
    <main className="pt-24">
      <ManageMeasurements measurements={measurements} />
    </main>
  );
}

export default page
