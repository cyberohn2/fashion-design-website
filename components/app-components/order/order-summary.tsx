"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { orders } from "@/app/(customer)/order-history/page";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function OrderSummary({ order }: { order: orders | null}) {
    const router = useRouter()

  return (
    <section className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white sticky top-0">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.back()} variant="ghost" size="icon" className="h-10 w-10">
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
            <p>{order?.items.length} items</p>
            <p>
              Placed on{" "}
              {order?.createdAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
              })}
            </p>
            <p>Total: ₦ {order?.total.toLocaleString()}</p>
          </div>
        </div>

        {/* Items Section */}
        {order?.order_type == "READY_MADE" &&<div className="mb-8">
          <h3 className="text-sm font-light uppercase tracking-widest text-gray-600 mb-4">
            Items in Your Order
          </h3>

          <Card className="border-gray-200">
            {order?.items.map((item, index) => (
              <div key={item.id}>
                {/* Status Badge */}
                <div className="px-6 pt-6 pb-3">
                  <p className="text-sm text-gray-600 mt-3">
                    On{" "}
                    {item.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                  </p>
                </div>

                <Separator className="my-0" />

                {/* Action Buttons */}
                <Separator className="my-0" />
                <div className="px-6 py-4 flex gap-3">
                  <Button className="flex-1 bg-black text-white hover:bg-gray-800 py-2 font-light tracking-wide">
                    Buy Again
                  </Button>
                  <Button
                    variant="ghost"
                    className="flex-1 font-light tracking-wide"
                  >
                    See Status History
                  </Button>
                </div>
              </div>
            ))}
          </Card>
        </div>}

        {/* Payment and Delivery Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Payment Information */}
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
                <p className="text-sm text-gray-900">
                  {order?.payment?.status}
                </p>
              </div>

              {order?.payment?.status === "PAID" && <div>
                <p className="text-sm font-light text-gray-600 mb-4">
                  Payment Details
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Items total:</span>
                    <span className="text-gray-900">
                      ₦ {order?.payment?.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>}
            </CardContent>
          </Card>

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

              <div>
                <p className="text-sm font-light text-gray-600 mb-2">
                  Shipping Details
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  {order?.estimated_delivery?.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
