import { getDress } from "@/actions/dresses/get-dress";
import CreateDressForm from "@/components/admin-components/product/create-dress-form";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
    const param = await params;
    const dressDetails = await getDress(param.id);
    const forForm = {
      id: dressDetails?.id as string,
      title: dressDetails?.title as string,
      description: dressDetails?.description as string,
      category: dressDetails?.category as string,
      gender: dressDetails?.gender as string,
      basePrice: dressDetails?.base_price as number,
      stockQuantity: dressDetails?.stock as number,
      imagesUrl: dressDetails?.images,
      isPublished: dressDetails?.isPublished
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