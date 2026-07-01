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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SubmitEvent, useEffect, useState } from "react";
import { DressType } from "./dress-card";
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
import PaystackPop from "@paystack/inline-js";
const popup = new PaystackPop();

export function NewOrderDialog({ dress }: { dress: DressType }) {
  const [formData, setFormData] = useState({
    dressId: dress.id,
    quantity: 1,
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
          fetch("/api/new-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: formData }),
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
          <DialogTitle>New Order</DialogTitle>
          <DialogDescription>
            Create new order for this dress.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup>
          <Field>
            <Label htmlFor="quantity">Quantity</Label>
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                size={"icon-sm"}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(1, prev.quantity - 1),
                  }))
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                −
              </Button>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.max(1, parseInt(e.target.value) || 1),
                  }))
                }
                className="w-12 text-center font-light bg-transparent border-none outline-none"
                min="1"
                max={dress?.stock}
              />
              <Button
                size={"icon-sm"}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: Math.min(dress?.stock || 1, prev.quantity + 1),
                  }))
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                +
              </Button>
            </div>
          </Field>

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
