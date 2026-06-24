"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Decimal } from "@prisma/client/runtime/client";

export type OrderStatus =
  | "PENDING_REVIEW"
  | "ACCEPTED"
  | "REJECTED"
  | "AWAITING_PAYMENT"
  | "PAID"
  | "IN_PRODUCTION"
  | "READY_FOR_DELIVERY"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus =
  | "UNPAID"
  | "PARTIALLY_PAID"
  | "PAID"
  | "REFUNDED"
  | "FAILED"
  | "PENDING"
  | "SUCCESS";

export type OrderType = "READY_MADE" | "SEMI_CUSTOM" | "FULL_CUSTOM";

export type DeliveryMethod = "PICKUP" | "LOCAL_DELIVERY" | "SHIPPING";

export interface OrderItem {
  id: string;
  orderId: string;
  dressId: string;
  quantity: number;
  price: number;
  createdAt: Date;
  dress: {
    id: string;
    title: string;
    slug: string;
    description: string;
    category:
      | "FEMALE_NATIVE"
      | "MALE_NATIVE"
      | "CORPORATE_MALE"
      | "CORPORATE_FEMALE"
      | "CASUAL"
      | "STREET_WEAR";
    gender: string;
    base_price: number;
    stock: number;
    thumbnail: string | null;
    createdAt: Date;
  } | null;
}

export interface CustomOrder {
  id: string;
  orderId: string;
  idea_image_url: string | null;
  selected_dress_id: string | null;
  material_choice: string | null;
  custom_material_notes: string | null;
  measurement_profile_id: string | null;
  customization_notes: string | null;
  customer_budget: Decimal | null;
  admin_final_price: Decimal | null;
}

export interface OrderStatusHistoryItem {
  id: string;
  orderId: string;
  oldStatus: OrderStatus | null;
  newStatus: OrderStatus;
  changedById: string;
  note: string | null;
  createdAt: Date;
}

export interface Payment {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  paidAt: Date;
  orderId: string;
  Provider: string;
  Provider_Reference: string;
  amount: number;
  status:
    | "UNPAID"
    | "PARTIALLY_PAID"
    | "PAID"
    | "REFUNDED"
    | "FAILED"
    | "PENDING"
    | "SUCCESS";
}

export interface DeliveryAddress {
    createdAt: Date;
    address: string;
    id: string;
    updatedAt: Date;
    userId: string;
    full_name: string;
    phone: string;
    country: string;
    state: string;
    city: string;
    postal_code: string | null;
    is_default: boolean | null;
}

export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  order_number: string;
  order_type: OrderType;
  status: OrderStatus;
  payment_status: PaymentStatus;
  delivery_method: DeliveryMethod;
  estimated_delivery: Date | null;
  notes: string | null;
  total: number;
  items: OrderItem[] | null;
  custom_order: CustomOrder | null;
  payment: Payment | null;
  statusHistory: OrderStatusHistoryItem[] | null;
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    full_name: string;
    phone: string;
    role: "USER" | "ADMIN";
  } | null;
  delivery_address: DeliveryAddress | null;
}

interface OrderDetailsProps {
  order: Order | null;
}

export const statusColorMap: Record<OrderStatus, string> = {
  PENDING_REVIEW: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-red-100 text-red-800",
  AWAITING_PAYMENT: "bg-orange-100 text-orange-800",
  PAID: "bg-green-100 text-green-800",
  IN_PRODUCTION: "bg-purple-100 text-purple-800",
  READY_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
  SHIPPED: "bg-cyan-100 text-cyan-800",
  DELIVERED: "bg-teal-100 text-teal-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-gray-100 text-gray-800",
};

export const paymentStatusColorMap: Record<PaymentStatus, string> = {
  UNPAID: "bg-red-100 text-red-800",
  PARTIALLY_PAID: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  REFUNDED: "bg-blue-100 text-blue-800",
  FAILED: "bg-red-100 text-red-800",
  PENDING: "bg-orange-100 text-orange-800",
  SUCCESS: "bg-green-100 text-green-800",
};

export function OrderDetails({ order }: OrderDetailsProps) {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(
    order?.status,
  );
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [updating, setUpdating] = useState(false)
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);

  const handleStatusUpdate = async (status?: string) => {
    if (selectedStatus === status) {
        setShowStatusDialog(false);
        return
    }
    setUpdating(true)
    const req = await fetch('/api/admin/orders/update-status', {
        method: "POST",
        body: JSON.stringify({orderId: order?.id, status: status || order?.status})
    })
    if (req.ok) {
        setUpdating(false);
        setShowStatusDialog(false);
    }else {
        setUpdating(false);
        setShowStatusDialog(false);
    }
  };

  const handleMarkAsPaid = async() => {
    if (order?.payment?.status === "PAID"){
        setShowPaymentDialog(false);
        return
    }
    setUpdating(true)
    const req = await fetch('/api/admin/payment/confirm-payment/', {
        method: "POST",
        body: JSON.stringify({orderId: order?.id})
    })
    if (req.ok) {
        setUpdating(false);
        setShowPaymentDialog(false);
    }else{
        setUpdating(false);
        setShowPaymentDialog(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Header Section */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">
                Order {order?.order_number}
              </CardTitle>
              <CardDescription>
                Created{" "}
                {format(new Date(order?.createdAt as Date), "MMM dd, yyyy")}
              </CardDescription>
              <div className="flex gap-2">
                <Badge className={statusColorMap[order?.status as OrderStatus]}>
                  {order?.status.replace(/_/g, " ")}
                </Badge>
                <Badge
                  className={
                    paymentStatusColorMap[
                      order?.payment_status as PaymentStatus
                    ]
                  }
                >
                  {order?.payment_status.replace(/_/g, " ")}
                </Badge>
              </div>
            </div>
            <div className="">
              <div className="space-x-4">
                {order?.status === "PENDING_REVIEW" ? (
                  <Button
                    disabled={updating}
                    onClick={() => handleStatusUpdate("ACCEPTED")}
                    className="bg-green-500"
                  >
                    Accept Order
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowStatusDialog(true)}
                    variant="outline"
                  >
                    Update Order Status
                  </Button>
                )}
                {order?.payment_status !== "PAID" && (
                  <Button
                    onClick={() => setShowPaymentDialog(true)}
                    variant="outline"
                  >
                    Mark as Paid
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Order Summary */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Order Type</p>
              <p className="font-medium">
                {order?.order_type.replace(/_/g, " ")}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600">Delivery Method</p>
              <p className="font-medium">
                {order?.delivery_method.replace(/_/g, " ")}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold">₦{order?.total.toFixed(2)}</p>
            </div>
            {order?.estimated_delivery && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Estimated Delivery</p>
                  <p className="font-medium">
                    {format(
                      new Date(order?.estimated_delivery),
                      "MMM dd, yyyy",
                    )}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order?.user && (
              <>
                <div>
                  <p className="text-sm text-gray-600">Customer Name</p>
                  <p className="font-medium">
                    {order?.user.full_name || "N/A"}
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{order?.user.email}</p>
                </div>
              </>
            )}
            {order?.delivery_address && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-gray-600">Delivery Address</p>
                  <p className="text-sm">
                    {order?.delivery_address.address}
                    <br />
                    {order?.delivery_address.city},{" "}
                    {order?.delivery_address.state}{" "}
                    {order?.delivery_address.postal_code}
                    <br />
                    {order?.delivery_address.country}
                  </p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order?.items && order?.items.length > 0 ? (
              order?.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center border-b pb-4"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {item.dress?.title || `Dress (${item.dressId})`}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">${item.price.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No items in this order</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Custom Order Details */}
      {order?.custom_order && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Order Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {order?.custom_order?.material_choice && (
              <div>
                <p className="text-sm text-gray-600">Material Choice</p>
                <p className="font-medium">
                  {order?.custom_order?.material_choice}
                </p>
              </div>
            )}
            {order?.custom_order?.custom_material_notes && (
              <div>
                <p className="text-sm text-gray-600">Material Notes</p>
                <p className="text-sm">
                  {order?.custom_order?.custom_material_notes}
                </p>
              </div>
            )}
            {order?.custom_order?.customization_notes && (
              <div>
                <p className="text-sm text-gray-600 font-bold">
                  Customization Notes
                </p>
                <p className="text-sm">
                  {order?.custom_order?.customization_notes}
                </p>
              </div>
            )}
            {order?.custom_order?.customer_budget && (
              <div>
                <p className="text-sm text-gray-600 font-bold">
                  Customer Budget
                </p>
                <p className="font-medium">
                  ₦{Number(order?.custom_order?.customer_budget).toFixed(2)}
                </p>
              </div>
            )}
            {order?.custom_order?.admin_final_price && (
              <div>
                <p className="text-sm text-gray-600">Admin Final Price</p>
                <p className="font-medium">
                  ${Number(order?.custom_order?.admin_final_price).toFixed(2)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Payment Details */}
      {order?.payment && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Provider</p>
              <p className="font-medium">{order?.payment.Provider}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="text-lg font-medium">
                ${order?.payment.amount.toFixed(2)}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600">Reference</p>
              <p className="text-sm font-mono">
                {order?.payment.Provider_Reference}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600">Payment Date</p>
              <p className="font-medium">
                {format(
                  new Date(order?.payment.paidAt),
                  "MMM dd, yyyy hh:mm a",
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Status History */}
      {order?.statusHistory && order?.statusHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Status History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order?.statusHistory.map((history) => (
                <div
                  key={history.id}
                  className="border-l-4 border-gray-300 pl-4 py-2"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-gray-600">
                      {history.oldStatus && `${history.oldStatus} → `}
                      {history.newStatus}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {format(new Date(history.createdAt), "MMM dd, yyyy")}
                    </Badge>
                  </div>
                  {history.note && (
                    <p className="text-sm text-gray-600">{history.note}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Order Notes */}
      {order?.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm whitespace-pre-wrap">{order?.notes}</p>
          </CardContent>
        </Card>
      )}

      {/* Status Update Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
            <DialogDescription>
              Select a new status for order {order?.order_number}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Select
              value={order?.status}
              onValueChange={(value) => setSelectedStatus(value as OrderStatus)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACCEPTED">Accept</SelectItem>
                <SelectItem value="REJECTED">Reject</SelectItem>
                <SelectItem value="IN_PRODUCTION">In Production</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="READY_FOR_DELIVERY">
                  Ready for Delivery
                </SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button
              disabled={updating}
              variant="outline"
              onClick={() => setShowStatusDialog(false)}
            >
              Cancel
            </Button>
            <Button disabled={updating} onClick={() => handleStatusUpdate()}>
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Mark as Paid Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Order as Paid</DialogTitle>
            <DialogDescription>
              Confirm marking order {order?.order_number} as paid. This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={updating}
              variant="outline"
              onClick={() => setShowPaymentDialog(false)}
            >
              Cancel
            </Button>
            <Button disabled={updating} onClick={handleMarkAsPaid}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
