import { Card, CardContent } from "@/components/ui/card"
import { User2 } from "lucide-react"
import Image from "next/image"
import { Order } from "../order/order-details";
import { DressType } from "@/components/app-components/catalog/dress-card";
import { formatDate } from "@/lib/format-table";

export type Review = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  dressId: string;
  rating: number;
  comment: string;
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
      <CardContent>
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
            <p>{review.comment}</p>
            <p>Review by: {review.user.full_name}</p>
        </div>
        <p>
            {formatDate(review.createdAt)}
        </p>
      </CardContent>
    </Card>
  )
}

export default ReviewCard
