"use client"
import { cartType } from "@/app/(customer)/cart/page"
import CartCard from "./cart-card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { CheckoutDialog } from "./checkout-dialog";
import { Card } from "@/components/ui/card";

const ManageCart = ({userCart}:{userCart: cartType}) => {
    let itemTotal = 0;
    let subTotal = 0;
    for (let i = 0; i < (userCart?.items?.length || 1); i++) {
        itemTotal+= userCart?.items[i]?.quantity || 1;
        subTotal += userCart?.items[i]?.quantity * Number(userCart?.items[i]?.dress.base_price); 
    } 

    const [ showCheckoutDialog, setShowCheckoutDialog ] = useState(false)
    const [ showDialog, setShowDialog ] = useState(false)
    const [ loading, setLoading ] = useState(false)
    const router = useRouter()

    const handleClearCart = async () => {
        setLoading(true);
        try {
          const req = await fetch(`/api/cart/clear`);
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
    <div>
      <div className="container mx-auto">
        <div className="border-b pb-6 flex items-center justify-between">
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
            Cart ({userCart?.items?.length})
          </h1>
        </div>
        <div className="grid lg:grid-cols-3 gap-3">
          <Card className="space-y-3 p-4 mt-8 min-h-screen col-span-2">
            <Button
              className="w-fit flex items-center"
              onClick={() => setShowDialog(true)}
            >
              <Trash2 /> Clear cart
            </Button>
            {userCart?.items?.map((item) => (
              <CartCard key={item.id} item={item} />
            ))}
          </Card>
          <Card className="space-y-4">
            <p className="font-bold text-xl text-black!">Cart Summary</p>
            <Separator />
            <p>Item's total ({itemTotal})</p>
            <Separator />
            <div className="flex items-center justify-between font-semibold text-black!">
              <p>Subtotal: </p>
              <p>{subTotal}</p>
            </div>
            <Separator />
            <Button className="" onClick={() => setShowCheckoutDialog(true)}>
              Checkout
            </Button>
          </Card>
        </div>
      </div>
      {/* checkout dialog */}
      <Dialog open={showCheckoutDialog} onOpenChange={setShowCheckoutDialog}>
        <CheckoutDialog />
      </Dialog>
      {/* clear cart dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Clear Cart?</DialogTitle>
            <DialogDescription>
              <p>
                Are you sure you want to clear your cart? <br />
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={loading}
              variant="outline"
              onClick={() => setShowDialog(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={loading}
              onClick={() => {
                userCart.items.length === 0
                  ? toast.message("Cart already empty")
                  : handleClearCart();
              }}
            >
              Clear Cart
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ManageCart
