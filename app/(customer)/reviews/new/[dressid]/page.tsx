import { ReviewForm } from "@/components/app-components/review/review-form";


const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ dressid: string }>;
  searchParams: Promise<{ type?: string, orderId?: string, orderItemId?: string }>;
}) => {
  const { dressid } = await params;
  const { type, orderId, orderItemId } = await searchParams;
  if(!type || (type !== "CUSTOMISED" && type !== "ORIGINAL")){
    return <p>Invalid type</p>;
  }
  if(type === "CUSTOMISED" && !orderId){
    return <p>Order ID is required for customised reviews</p>;
  }
  if(type === "ORIGINAL" && !orderItemId){
    return <p>Order Item ID is required for original reviews</p>;
  }

  return (
    <main className="py-24 container mx-auto">
      <ReviewForm dressId={dressid} type={type} orderId={orderId as string} orderItemId={orderItemId as string} />
    </main>
  );
};

export default Page;