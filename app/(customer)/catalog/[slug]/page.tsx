import { getDress } from "@/actions/dresses/get-dress";
import { DressType } from "@/components/app-components/catalog/dress-card";
import DressPage from "@/components/app-components/catalog/dress-page";

type dressPageType = DressType & { isInCart: boolean };

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const param = await params;
  const dress = await getDress(param.slug);

  if (!dress) {
    return (
      <main className="pt-24 container mx-auto px-4 min-h-screen">
        <p>Dress not found!</p>
      </main>
    );
  }

  return (
    <main className="pt-24 container mx-auto px-4 min-h-screen">
      <DressPage dress={dress} />
    </main>
  );
}
