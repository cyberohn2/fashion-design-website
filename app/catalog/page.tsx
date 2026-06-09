import { getDresses } from "@/actions/dresses/get-dresses";
import Catalog from "@/components/app-components/catalog";

const page = async () => {
  let dresses;
  try {
    dresses = await getDresses();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
  }
  

  return (
    <main className="pt-34 md:pt-24 container mx-auto px-4">
      <Catalog products={dresses} />
    </main>
  );
};

export default page;
