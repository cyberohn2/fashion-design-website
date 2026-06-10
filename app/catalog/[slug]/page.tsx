import { getDress } from "@/actions/dresses/get-dress";
import { ProductType } from "@/components/app-components/product-card";
import ProductPage from "@/components/app-components/product-page";


export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  try {
    const param = await params;
    const dress: ProductType | null = await getDress(param.slug);

    return(
        <main className="pt-34 md:pt-24 container mx-auto px-4 min-h-screen">
            <ProductPage product={dress}/>
        </main>
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(message);
  }
}
