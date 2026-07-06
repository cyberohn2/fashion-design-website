"use client";

import {
  Card,
  CardFooter,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import Star from "@/components/ui/Star";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type Reviews = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  dressId: string;
  userId: string;
  rating: number;
  comment: string;
};

export type DressImages = {
  id: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  dressId: string;
};

export type DressType = {
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
  type: "BESPOKE" | "KAFTAN" | "MONOGRAM" | "NATIVE" | "READYMADE";
  gender: string;
  base_price: number;
  stock: number;
  soldCount: number;
  thumbnail: string | null;
  images?: DressImages[];
  isPublished?: boolean;
  reviews?: Reviews[];
  createdAt: Date;
};

const DressCard = ({ dress }: { dress: DressType }) => {
  const averageRating = useMemo(() => {
    if (!dress.reviews?.length) return 0;

    const total = dress.reviews.reduce((sum, review) => sum + review.rating, 0);

    return total / dress.reviews.length;
  }, [dress.reviews]);

  const stars = useMemo(() => {
    const full = Math.floor(averageRating);
    const remainder = averageRating - full;

    const hasHalf = remainder >= 0.25 && remainder < 0.75;
    const roundUp = remainder >= 0.75;

    const result = [];

    for (let i = 0; i < full; i++) {
      result.push("full");
    }

    if (hasHalf) result.push("half");
    if (roundUp) result.push("full");

    while (result.length < 5) {
      result.push("empty");
    }

    return result;
  }, [averageRating]);

  const gradId = useMemo(
    () => `half-grad-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );

  return (
    <Card className="relative flex flex-col gap-2 pt-0 pb-1 h-fit">
      <Badge variant={"secondary"} className="absolute top-2 right-2 z-20">
        {dress?.category}
      </Badge>

      <div>
        <img
          className="w-full max-h-42.5 aspect-square object-cover object-top rounded-sm rounded-b-xl "
          src={
            dress?.thumbnail
              ? dress.thumbnail
              : dress.images && dress?.images[0]?.url
          }
          alt={dress?.title}
        />
      </div>
      <div className="p-0 px-2 grow flex flex-col justify-between">
        <div>
          <CardTitle className="font-semibold text-sm h-10">
            <Link href={`/catalog/${dress?.slug}`}>{dress?.title}</Link>
          </CardTitle>
        </div>
        <CardContent className="p-0 mt-2 mb-2 flex items-center justify-between">
          <p className="text-sm text-gray-600">₦{dress?.base_price}</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center" aria-hidden>
              {stars.map((t, i) => (
                <span key={i} className="inline-flex">
                  <Star type={t} gradId={gradId} />
                </span>
              ))}
            </div>
            {dress?.reviews?.length && dress?.reviews?.length > 0 ? (
              <span className="text-sm text-gray-600">
                {averageRating.toFixed(1)} ({dress.reviews?.length})
              </span>
            ) : (
              <span className="text-sm text-gray-500">No reviews</span>
            )}
          </div>
        </CardContent>
        <CardFooter className="w-full my-2 px-0">
          <Link
            className="block  w-full"
            href={`/create-order/${dress?.slug}`}
          >
            <Button variant={"outline"} className="w-full cursor-pointer">
              Custom Order
            </Button>
          </Link>
          <Link className="block  w-full" href={`/catalog/${dress?.slug}`}>
            <Button className="w-full cursor-pointer">Buy Now</Button>
          </Link>
        </CardFooter>
      </div>
    </Card>
  );
};

export default DressCard;