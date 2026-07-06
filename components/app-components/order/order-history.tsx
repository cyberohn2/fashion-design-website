"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SearchSlash } from "lucide-react";
import { userOrder } from "@/app/(customer)/order-history/page";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useState } from "react";
import { getPaginationItems } from "@/lib/getPaginationItems";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const OrderHistory = ({ orders, totalOrders, page }: { orders: userOrder[] | undefined; totalOrders: number; page: number }) => {
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

  const [fetchedOrders, setFetchedOrders] = useState({
    orders,
    totalOrders,
    page,
  });

  const ongoingOrders = fetchedOrders?.orders?.filter((order) =>
    [
      "ACCEPTED",
      "AWAITING_PAYMENT",
      "COMPLETED",
      "DELIVERED",
      "SHIPPED",
      "PAID",
      "IN_PRODUCTION",
      "READY_FOR_DELIVERY",
    ].includes(order.status),
  );

  const pendingOrders = fetchedOrders?.orders?.filter((order) =>
    ["AWAITING", "PENDING_REVIEW"].includes(order.status),
  );

  const cancelledOrders = fetchedOrders?.orders?.filter((order) =>
    ["REJECTED", "CANCELLED"].includes(order.status),
  );

  const ITEMS_PER_PAGE = 20;
  const totalPages = Math.ceil(fetchedOrders.totalOrders / ITEMS_PER_PAGE);
  const paginationItems = getPaginationItems(fetchedOrders.page, totalPages);

  const [isFetching, setIsFetching] = useState(false);
  
    const handleFetchedOrders = async (page: number) => {
      if (isFetching) {
        return;
      }
      setIsFetching(true);
      const newOrders = await fetch(`/api/orders?page=${page}`);
      if (newOrders.ok) {
        newOrders.json().then((data) => {
          setFetchedOrders({
            orders: data.orders,
            totalOrders: data.totalOrders,
            page: data.page,
          });
          setIsFetching(false);
        });
      } else {
        setFetchedOrders((prev) => prev);
        toast.error("Error fetching orders.", {
          position: "top-right",
        });
        setIsFetching(false);
      }
    };

  const router = useRouter()
  const handlePayment = async (order: userOrder) => {
    const payment = await toast
      .promise(
        fetch("/api/payment/initialize", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            orderId: order.id,
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
  }

  return (
    <section className="px-4 container mx-auto min-h-screen">
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
                  className="flex-col md:flex-row items-start justify-between gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
                >
                  <div className="flex">
                    <Image
                      src={order.custom_order?.idea_image_url as string}
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
                      {order.payment?.some((pay) => pay.status === "PAID") ? (
                        <Badge>PAID</Badge>
                      ) : (
                        <Badge>UNPAID</Badge>
                      )}
                      <p>
                        On:{" "}
                        {format(
                          new Date(order.createdAt) as Date,
                          "MMM dd, yyyy",
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant={"outline"}>
                      <Link href={`/order-history/${order.order_number}`}>
                        See Details
                      </Link>
                    </Button>
                    {(order.payment?.every((pay) => pay.status !== "PAID") ||
                      !order.payment) && (
                      <Button onClick={() => handlePayment(order)}>
                        Complete Payment
                      </Button>
                    )}
                  </div>
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
                        (order.custom_order?.idea_image_url as string) ||
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
                        (order.custom_order?.idea_image_url as string) ||
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
        <Pagination className="py-5 mt-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => fetchedOrders.page > 1 && handleFetchedOrders(fetchedOrders.page - 1)}
                aria-disabled={fetchedOrders.page === 1}
                className={fetchedOrders.page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {paginationItems.map((item, index) => (
              <PaginationItem key={`${item}-${index}`}>
                {item === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    onClick={() => handleFetchedOrders(fetchedOrders.page)}
                    isActive={item === fetchedOrders.page}
                  >
                    {item}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}

            <PaginationItem>
              <PaginationNext
                onClick={() => handleFetchedOrders(fetchedOrders.page + 1)}
                aria-disabled={fetchedOrders.page === totalPages}
                className={
                  fetchedOrders.page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};

export default OrderHistory;
