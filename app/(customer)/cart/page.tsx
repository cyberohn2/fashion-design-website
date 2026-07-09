import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { getUserCart } from "@/actions/cart/get-user-cart";
import { SearchSlash } from "lucide-react";
import Link from "next/link";
import { DressType } from "@/components/app-components/catalog/dress-card";
import ManageCart from "@/components/app-components/cart/manage-cart";

export type cartType = {
    id: string
    createdAt: Date
    updatedAt: Date
    userId: string
    items: CartItems[]
}

export type CartItems = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  cartId: string;
  dressId: string;
  quantity: number;
  dress: DressType;
};

const page = async () => {
  const userCart = await getUserCart();
  if (userCart?.items.length === 0 || !userCart) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <SearchSlash />
          </EmptyMedia>
          <EmptyTitle>Nothing here!</EmptyTitle>
          <EmptyDescription>
            You don't have anything in you cart yet.
            <Link href={"/catalog"}>Browse catalog</Link>
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }
  return (
    <main className="pt-24 container mx-auto px-4 min-h-screen">
      <ManageCart userCart={userCart} />
    </main>
  );
};

export default page;
