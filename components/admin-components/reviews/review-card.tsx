import { Card, CardContent } from "@/components/ui/card"
import { User2 } from "lucide-react"
import Image from "next/image"
import { Order } from "../order/order-details";
import { DressType } from "@/components/app-components/catalog/dress-card";
import { formatDate } from "@/lib/format-table";
import { Badge } from "@/components/ui/badge";

export type Review = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  dressId: string;
  rating: number;
  comment: string;
  type: "CUSTOMISED" | "ORIGINAL";
  user: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    email: string;
    full_name: string;
    phone: string;
    role: "USER" | "ADMIN";
  };
  dress: DressType;
};

const ReviewCard = ({review}: {review: Review}) => {
  return (
    <Card>
      <CardContent className="flex gap-4 items-center relative">
        <Image
            src={
            (review.dress.thumbnail) ||
            "/logo.webp"
            }
            alt="order-image"
            width={100}
            height={100}
        />
        <div>
            <p className="text-black">{review.comment}</p>
            <p><span className="font-bold">Review by:</span> {review.user.full_name}</p>
            <p>
                {formatDate(review.createdAt)}
            </p>
        </div>
        <Badge className="absolute top-0 right-2">{review.type}</Badge>
      </CardContent>
    </Card>
  )
}

export default ReviewCard
