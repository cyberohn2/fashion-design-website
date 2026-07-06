
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link2 } from "lucide-react";
import Link from "next/link";

export default function SectionCards(
    {overViewData}: 
    {overViewData?: {
        totalRevenue: number,
        totalOrder: number, 
        pendingReviews: number,
        customers: number,
    }}) {
    const sections = [
      {
        title: "Total Orders",
        value: overViewData?.totalOrder,
        description: "Total orders in the last 30 days.",
        action: {
          title: "See All",
          url: "/admin/orders",
        },
      },
      {
        title: "Total Revenue",
        value: `₦${overViewData?.totalRevenue}`,
        description: "Total revenue in the last 30 days.",
        action: {
          title: "Analyse",
          url: "/admin/payments",
        },
      },
      {
        title: "Pending Reviews",
        value: overViewData?.pendingReviews,
        description: "Accept/Reject new orders.",
        action: {
          title: "See All",
          url: "/admin/orders?type=pending",
        },
      },
      {
        title: "Customers",
        value: overViewData?.customers,
        description: "Total number of customers in the last 30 days.",
        action: {
          title: "See All",
          url: "/admin/customers",
        },
      },
    ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      {sections.map((section) => (
        <Card key={section.title} className="@container/card">
          <CardHeader>
            <CardDescription>{section.title}</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {section.value}
            </CardTitle>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="text-muted-foreground">
              {section.description}
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
