import { getDresses } from "@/actions/dresses/get-dresses";
import Catalog from "@/components/app-components/catalog";

const page = async () => {
  const dresses = await getDresses();

  return (
    <main className="py-24 pt-34 md:pt-24 container mx-auto px-4">
      <Catalog products={dresses} />
    </main>
  );
};

export default page;
