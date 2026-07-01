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
    type?: "BESPOKE" | "KAFTAN" | "MONOGRAM" | "NATIVE" | "READYMADE";
  }>;
}) => {
  const { searchTerm, category, type } = await searchParams;
  let dresses;
  if (searchTerm || category || type) {
      dresses = await getDresses({
        query: { searchTerm, category, type },
        pagination: { page: 1 },
      });
  }else{
    dresses = await getDresses({
      pagination: { page: 1 },
    });
  }

  return (
    <main className="pt-24 container mx-auto px-4">
      <Catalog
        dresses={dresses.AllDresses}
        totalDresses={dresses.totalDresses}
        page={dresses.page}
      />
    </main>
  );
};

export default page;