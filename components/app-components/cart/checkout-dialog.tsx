"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { type address } from "../address/manage-address";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { toast } from "sonner";
import { userOrder } from "@/app/(customer)/order-history/page";
import { useRouter } from "next/navigation";

export function CheckoutDialog() {
  const [formData, setFormData] = useState({
    notes: "",
    deliveryMethod: "PICKUP",
    deliveryAddressId: "",
  });
  const router = useRouter();

  const [addresses, setAddresses] = useState<address[]>();
  useEffect(() => {
    const fetchAddresses = async () => {
      const req = await fetch(`/api/address/get-address`);
      if (req.ok) {
        req.json().then((data) => setAddresses(data));
      }
    };

    fetchAddresses();
  }, []);

  const [isLoading, setIsLoading] = useState(false);

  const handleBuy = async () => {
    if (isLoading) return;

    setIsLoading(true);

    try {
      const createdOrder = await toast
        .promise(
          fetch("/api/cart/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({data: {...formData}}),
          }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to create order");
            return res.json() as Promise<userOrder>;
          }),
          {
            loading: "Creating order...",
            success: (data) =>
              `Order created with Number ${data.order_number}!`,
            error: (err) => err.message,
          },
        )
        .unwrap();

      const payment = await toast
        .promise(
          fetch("/api/payment/initialize", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              orderId: createdOrder.id,
            }),
          }).then(async (res) => {
            if (!res.ok) throw new Error("Failed to initialise payment");
            return res.json();
          }),
          {
            loading: "Initializing payment...",
            success: (data) => {
              router.push(data.authorization_url);
              return "Payment initialized";
            },
            error: "Error while initializing payment!",
          },
        )
        .unwrap();

      // router.push(payment.authorization_url);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleBuy}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Checkout</DialogTitle>
          <DialogDescription>
            Create new order.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="address">Address *</Label>
            <Select
              required
              value={formData.deliveryAddressId}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, deliveryAddressId: value }))
              }
            >
              <SelectTrigger id="address" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {addresses?.map((address) => (
                  <SelectItem value={address.id}>{address.address}</SelectItem>
                ))}
                <Link href={"/address/new"}>Add New Address</Link>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label htmlFor="delivery-method">Delivery Method *</Label>
            <Select
              required
              value={formData.deliveryMethod}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, deliveryMethod: value }))
              }
            >
              <SelectTrigger id="delivery-method" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PICKUP">Pick Up</SelectItem>
                <SelectItem value="LOCAL_DELIVERY">Home Delivery</SelectItem>
                <SelectItem value="SHIPPING">Shipping</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              placeholder="Instructions for your order"
              id="notes"
              name="notes"
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose disabled={isLoading} asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isLoading} type="submit" onClick={handleBuy}>
            Place Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  );
}
