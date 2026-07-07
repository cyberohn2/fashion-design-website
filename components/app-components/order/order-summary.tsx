"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Order } from "@/components/admin-components/order/order-details";
import { userOrder } from "@/app/(customer)/order-history/page";
import Link from "next/link";
import { format } from "date-fns";

export default function OrderSummary({ order }: { order: userOrder | null}) {
    const router = useRouter()

  return (
    <section className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="ghost"
              size="icon"
              className="h-10 w-10"
            >
              <ArrowLeft className="w-5 h-5 text-black" />
            </Button>
            <h1 className="text-2xl tracking-wide">Order Details</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Order Header Info */}
        <div className="mb-8">
          <h2 className="text-lg font-light mb-4">
            Order n° {order?.order_number} <Badge>{order?.status}</Badge>
          </h2>
          <div className="text-sm text-gray-600 space-y-1">
            <p>{order?.items?.length} items</p>
            <p>
              Placed on{" "}
              {order?.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
            <p>
              Total: ₦{" "}
              {order?.payment?.some((pay) => pay.status === "PAID")
                ? order?.payment?.find((pay) => pay.status === "PAID")?.amount
                : 0}
            </p>
          </div>
        </div>

        {/* Items Section */}
        {order?.order_type === "READY_MADE" && (
          <div className="mb-8">
            <h3 className="text-sm font-light uppercase tracking-widest text-gray-600 mb-4">
              Items in Your Order
            </h3>

            <Card className="border-gray-200">
              {order?.items?.map((item) => (
                <div key={item.id}>
                  {/* Status Badge */}
                  <div className="px-6 pt-6 pb-3 flex items-start gap-3">
                    <img
                      width={50}
                      height={50}
                      src={item.dress?.thumbnail || "/logo"}
                      alt={item.dress?.title}
                    />
                    <div>
                      <p className="font-bold">{item.dress?.title}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>

                  <Separator className="my-0" />

                  {/* Action Buttons */}
                  <Separator className="my-0" />
                  <div className="px-6 py-4 flex gap-3">
                    {order.payment?.some((pay) => pay.status === "PAID") &&
                      item?.review_status === "PENDING" && (
                        <Button variant={"secondary"}>
                          <Link href={`/reviews/new/${item.dressId}?type=ORIGINAL`}>
                            Write Review
                          </Link>
                        </Button>
                      )}
                    <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-2 font-light tracking-wide">
                      <Link href={`/catalog/${item.dress?.slug}`}>
                        Buy Again
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {order?.order_type !== "READY_MADE" && (
          <div className="mb-8">
            <h3 className="text-sm font-light uppercase tracking-widest text-gray-600 mb-4">
              Custom Order Details
            </h3>

            <Card className="border-gray-200">
              <div className="px-6 pt-6 pb-3 flex items-start gap-3">
                <img
                  width={50}
                  height={50}
                  src={
                    order?.custom_order?.dress?.thumbnail ||
                    order?.custom_order?.idea_image_url ||
                    "/logo"
                  }
                  alt={order?.custom_order?.dress?.title || ""}
                />
                <div>
                  <p className="font-bold">
                    {order?.custom_order?.customization_notes}
                  </p>
                  <p className="text-sm text-gray-600">
                    Your Budget:{" "}
                    {order?.custom_order?.customer_budget
                      ? `₦ ${order?.custom_order?.customer_budget.toLocaleString()}`
                      : "Not specified"}
                  </p>
                  <p>
                    Final Price:{" "}
                    {order?.custom_order?.admin_final_price
                      ? `₦ ${order?.custom_order?.admin_final_price.toLocaleString()}`
                      : "Not specified"}
                  </p>
                </div>
              </div>
              <Separator className="my-0" />
              {order?.payment?.some((pay) => pay.status === "PAID") &&
                order?.custom_order?.review_status === "PENDING" && (
                  <Button variant={"secondary"}>
                    <Link
                      href={`/reviews/new/${order.custom_order?.selected_dress_id}?type=CUSTOMISED`}
                    >
                      Write Review
                    </Link>
                  </Button>
                )}
            </Card>
          </div>
        )}

        {order?.statusHistory && order?.statusHistory.length > 0 && (
          <Card className="mb-6">
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

        {/* Payment and Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Information */}
          {order?.payment && (
            <Card className="border-gray-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-base font-light">
                  Payment Information
                </CardTitle>
              </CardHeader>
              <Separator className="my-0" />
              <CardContent className="pt-6 space-y-6">
                <div>
                  <p className="text-sm font-light text-gray-600 mb-2">
                    Payment Status
                  </p>
                  <Badge className="text-sm">{order?.payment[0].status}</Badge>
                </div>

                {order?.payment?.some((pay) => pay.status === "PAID") && (
                  <div>
                    <p className="text-sm font-light text-gray-600 mb-4">
                      Payment Details
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Items total:</span>
                        <span className="text-gray-900">
                          ₦{" "}
                          {order?.payment
                            ?.find((p) => p.status === "PAID")
                            ?.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Delivery Information */}
          <Card className="border-gray-200">
            <CardHeader className="pb-4">
              <CardTitle className="text-base font-light">
                Delivery Information
              </CardTitle>
            </CardHeader>
            <Separator className="my-0" />
            <CardContent className="pt-6 space-y-6">
              <div>
                <p className="text-sm font-light text-gray-600 mb-2">
                  Delivery Method
                </p>
                <p className="text-sm text-gray-900">
                  {order?.delivery_method}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
