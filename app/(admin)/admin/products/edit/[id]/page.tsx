import { getDress } from "@/actions/dresses/get-dress";
import CreateDressForm from "@/components/admin-components/product/create-dress-form";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const param = await params;
  const dressDetails = await getDress(param.id);

  if (!dressDetails) {
    return <div>Dress not found</div>;
  }

  const forForm = {
    id: dressDetails.id,
    title: dressDetails.title,
    description: dressDetails.description,
    category: dressDetails.category,
    gender: dressDetails.gender,
    basePrice: dressDetails.base_price,
    stockQuantity: dressDetails.stock,
    imagesUrl: dressDetails.images,
    isPublished: dressDetails.isPublished,
  };
  
  return (
    <main className="@container/main flex flex-1 flex-col gap-2 px-6">
      <div className="flex flex-col gap-4 py-18 md:gap-6 md:py-6">
        <CreateDressForm dressData={forForm} />
      </div>
    </main>
  );
};

export default page;