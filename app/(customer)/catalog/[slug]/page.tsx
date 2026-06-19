import { getDress } from "@/actions/dresses/get-dress";
import { ProductType } from "@/components/app-components/catalog/product-card";
import ProductPage from "@/components/app-components/catalog/product-page";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const param = await params;
  const dress: ProductType | null = await getDress(param.slug);

  return (
    <main className="pt-34 md:pt-24 container mx-auto px-4 min-h-screen">
      <ProductPage product={dress} />
    </main>
  );
}
