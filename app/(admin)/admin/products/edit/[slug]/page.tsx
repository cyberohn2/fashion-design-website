import { getDress } from "@/actions/dresses/get-dress";
import CreateDressForm from "@/components/admin-components/dress/create-dress-form";

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const param = await params;
  const dressDetails = await getDress(param.slug);

  if (!dressDetails) {
    return <div>Dress not found</div>;
  }

  const forForm = {
    id: dressDetails.id,
    title: dressDetails.title,
    description: dressDetails.description,
    category: dressDetails.category,
    type: dressDetails.type,
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