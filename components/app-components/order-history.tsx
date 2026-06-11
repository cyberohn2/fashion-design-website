import { orders } from "@/app/(customer)/order-history/page";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchSlash } from "lucide-react";

const OrderHistory = ({ orders }: { orders: orders[] | undefined }) => {
  const orderStatusColors = {
    PENDING_REVIEW: "bg-gray-100 text-gray-800",
    ACCEPTED: "bg-blue-100 text-blue-800",
    REJECTED: "bg-red-100 text-red-800",
    AWAITING_PAYMENT: "bg-amber-100 text-amber-800",
    PAID: "bg-green-100 text-green-800",
    IN_PRODUCTION: "bg-purple-100 text-purple-800",
    READY_FOR_DELIVERY: "bg-indigo-100 text-indigo-800",
    SHIPPED: "bg-cyan-100 text-cyan-800",
    DELIVERED: "bg-teal-100 text-teal-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-rose-100 text-rose-800",
  };

  const ongoingOrders = orders?.filter((order) =>
    [
      "ACCEPTED",
      "COMPLETED",
      "DELIVERED",
      "SHIPPED",
      "PAID",
      "IN_PRODUCTION",
      "READY_FOR_DELIVERY",
    ].includes(order.status),
  );

  const pendingOrders = orders?.filter((order) =>
    ["AWAITING", "PENDING_REVIEW"].includes(order.status),
  );

  const cancelledOrders = orders?.filter((order) =>
    ["REJECTED", "CANCELLED"].includes(order.status),
  );

  return (
    <section className="px-4 py-6 container mx-auto min-h-screen">
      <div className="mb-4">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
          Order History
        </h1>
      </div>
      <div>
        <Tabs defaultValue={"ongoing"} className="w-full ">
          <TabsList className="border-b border-border">
            <TabsTrigger value="ongoing">Ongoing/Delivered</TabsTrigger>
            <TabsTrigger value="pending">Pending Approval</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>

          <TabsContent value="ongoing" className="space-y-6">
            {ongoingOrders?.length ? (
              ongoingOrders.map((order) => (
                <Card
                  key={order.id}
                  className="flex-row items-start justify-between gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex">
                    <Image
                      src={
                        (order.custom_order?.ideaImageUrl as string) ||
                        "/logo.webp"
                      }
                      alt="order-image"
                      width={100}
                      height={100}
                    />
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-bold">{order.order_number}</h3>
                        <Badge>{order.order_type}</Badge>
                      </div>
                      <Badge className={orderStatusColors[order.status]}>
                        {order.status}
                      </Badge>
                      <p>On: {order.createdAt.getDate()}</p>
                    </div>
                  </div>
                  <Link href={`/order-history/${order.order_number}`}>
                    See Details
                  </Link>
                </Card>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchSlash />
                  </EmptyMedia>
                  <EmptyTitle>Nothing here!</EmptyTitle>
                  <EmptyDescription>
                    You haven't made any ongoing orders.
                    <Link href="/catalog">Browse Catalog</Link>
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
          <TabsContent value="pending" className="space-y-6 ">
            {pendingOrders?.length ? (
              pendingOrders.map((order) => (
                <Card
                  key={order.id}
                  className="flex-row items-start justify-between gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex">
                    <Image
                      src={
                        (order.custom_order?.ideaImageUrl as string) ||
                        "/logo.webp"
                      }
                      alt="order-image"
                      width={100}
                      height={100}
                    />
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-bold">{order.order_number}</h3>
                        <Badge>{order.order_type}</Badge>
                      </div>
                      <Badge className={orderStatusColors[order.status]}>
                        {order.status}
                      </Badge>
                      <p>On: {order.createdAt.getDate()}</p>
                    </div>
                  </div>
                  <Link href={`/order-history/${order.order_number}`}>
                    See Details
                  </Link>
                </Card>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchSlash />
                  </EmptyMedia>
                  <EmptyTitle>Nothing here!</EmptyTitle>
                  <EmptyDescription>
                    You haven't made any ongoing orders.
                    <Link href="/catalog">Browse Catalog</Link>
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
          <TabsContent value="cancelled" className="space-y-6 ">
            {cancelledOrders?.length ? (
              cancelledOrders.map((order) => (
                <Card
                  key={order.id}
                  className="flex-row items-start justify-between gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex">
                    <Image
                      src={
                        (order.custom_order?.ideaImageUrl as string) ||
                        "/logo.webp"
                      }
                      alt="order-image"
                      width={100}
                      height={100}
                    />
                    <div>
                      <div className="flex items-center gap-4 mb-4">
                        <h3 className="font-bold">{order.order_number}</h3>
                        <Badge>{order.order_type}</Badge>
                      </div>
                      <Badge className={orderStatusColors[order.status]}>
                        {order.status}
                      </Badge>
                      <p>On: {order.createdAt.getDate()}</p>
                    </div>
                  </div>
                  <Link href={`/order-history/${order.order_number}`}>
                    See Details
                  </Link>
                </Card>
              ))
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchSlash />
                  </EmptyMedia>
                  <EmptyTitle>Nothing here!</EmptyTitle>
                  <EmptyDescription>
                    You haven't made any ongoing orders.
                    <Link href="/catalog"> Browse Catalog</Link>
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default OrderHistory;
