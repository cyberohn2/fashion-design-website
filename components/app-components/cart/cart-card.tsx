"use client"
import { CartItems } from "@/app/(customer)/cart/page";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const CartCard = ({item}: {item: CartItems}) => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleAddToCart = async () => {
        setLoading(true)
        if (item.quantity + 1 >= item.dress.stock) {
            toast.error("Out of stock!")
            return
        }
        try {
            const req = await fetch(`/api/cart/add`, {
                method: "POST",
                body: JSON.stringify({data: {dressId: item.dressId, quantity: item.quantity + 1}})
            })
            if (req.ok){
                toast.success("Success!")
                router.refresh()
            }
        } catch (error) {
            const message = error instanceof Error ? error.message : String(error)
            toast.error(message)
            setLoading(false)
        } finally{
            setLoading(false)
        }
    }

    const handleRemoveFromCart = async () => {
        setLoading(true)

        try {
          const req = await fetch(`/api/cart/remove`, {
            method: "POST",
            body: JSON.stringify({data:{ dressId: item.dressId }}),
          });
          if (req.ok) {
            toast.success("Success!");
            router.refresh();
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          toast.error(message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
    }

    const handleDeleteItem = async () => {
        setLoading(true)

        try {
          const req = await fetch(`/api/cart/delete`, {
            method: "POST",
            body: JSON.stringify({data: item.id}),
          });
          if (req.ok) {
            toast.success("Success!");
            router.refresh();
          }
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          toast.error(message);
          setLoading(false);
        } finally {
          setLoading(false);
        }
    }
  return (
    <Card className="space-y-4">
      <div className="flex items-start gap-2">
        <img
          width={100}
          height={100}
          src={item.dress.thumbnail || ""}
          alt={item.dress.title}
        />
        <div className="flex items-start flex-col md:flex-row">
          <div>
            <p className="font-bold text-xl">{item.dress.title}</p>
            <p>{item.dress.type}</p>
          </div>
          <p className="font-bold text-black!">
            ₦{Number(item.dress.base_price)}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button disabled={loading} onClick={() => handleDeleteItem()}>
          <Trash />
        </Button>
        <div className="flex items-center justify-between border border-gray-300 rounded-lg flex-1">
          <Button
            disabled={loading}
            size={"icon-sm"}
            onClick={() => handleRemoveFromCart()}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            −
          </Button>
          <p>{item.quantity}</p>
          <Button
            disabled={loading}
            size={"icon-sm"}
            onClick={() => handleAddToCart()}
            className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
          >
            +
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default CartCard
