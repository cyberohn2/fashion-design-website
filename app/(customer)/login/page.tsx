import { LoginForm } from "@/components/app-components/auth/LoginForm"

const page = async ({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) => {
  const { from } = await searchParams;

  return (
    <main className="py-24 pt-24 container mx-auto">
      <div className="w-full max-w-sm md:max-w-4xl mx-auto">
        <LoginForm from={from?.startsWith("/") ? from : "/catalog"} />
      </div>
    </main>
  );
};

export default page
