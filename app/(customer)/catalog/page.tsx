import { getDresses } from "@/actions/dresses/get-dresses";
import Catalog from "@/components/app-components/catalog/catalog";

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{
    searchTerm?: string;
    category?:
      | "FEMALE_NATIVE"
      | "MALE_NATIVE"
      | "CORPORATE_MALE"
      | "CORPORATE_FEMALE"
      | "CASUAL"
      | "STREET_WEAR";
  }>;
}) => {
  const { searchTerm, category } = await searchParams;
  let dresses;
  dresses = await getDresses({ query: { searchTerm, category } });
  return (
    <main className="pt-34 md:pt-24 container mx-auto px-4">
      <Catalog products={dresses} />
    </main>
  );
};

export default page;