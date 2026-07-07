import { ReviewForm } from "@/components/app-components/review/review-form";


const Page = async ({
  params,
  searchParams,
}: {
  params: Promise<{ dressid: string }>;
  searchParams: Promise<{ type?: string }>;
}) => {
  const { dressid } = await params;
  const { type } = await searchParams;
  if(!type || (type !== "CUSTOMISED" && type !== "ORIGINAL")){
    return <p>Invalid type</p>;
  }

  return (
    <main className="py-24 container mx-auto">
      <ReviewForm dressId={dressid} type={type} />
    </main>
  );
};

export default Page;