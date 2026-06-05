"use client";

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Star from "@/components/ui/Star";
import { useMemo, useState } from "react";
import { HeartIcon } from "lucide-react";
import { Button } from "../../components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { Badge } from "../ui/badge";

export type ProductType = {
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
    gender: string
    base_price: string
    stock: number;
    thumbnail: string
    images: string[]
    reviews: any
};

const ProductCard = ({ product }: { product: ProductType }) => {
  const stars = useMemo(() => {
    // determine full/half/empty for 5-star display
    const full = Math.floor(product?.reviews?.rating);
    const remainder = product?.reviews?.rating - full;
    const hasHalf = remainder >= 0.25 && remainder < 0.75;
    const roundUp = remainder >= 0.75;
    const result = [];

    for (let i = 0; i < full; i++) result.push("full");
    if (hasHalf) result.push("half");
    if (roundUp) result.push("full");
    while (result.length < 5) result.push("empty");

    return result;
  }, [product?.reviews?.rating]);

  const gradId = useMemo(
    () => `half-grad-${Math.random().toString(36).slice(2, 8)}`,
    [],
  );
  

  return (
    <div>
      <Card className="relative min-h-75 flex flex-col gap-2 pt-0 pb-1">
        <Badge variant={"secondary"} className="absolute top-2 right-2 z-20">
          {product?.category}
        </Badge>

        <div>
          <img
            className="w-full max-h-42.5 aspect-square object-cover object-top rounded-sm rounded-b-xl "
            src={product?.thumbnail}
            alt={product?.title}
          />
        </div>
        <div className="p-0 px-2 grow flex flex-col justify-between">
          <div>
            <CardTitle className="font-semibold text-sm h-10">
              <Link href={`/app/products/${product?.id}`}>{product?.title}</Link>
            </CardTitle>
          </div>
          <CardContent className="p-0 mt-2 mb-2 flex items-center justify-between">
            <p className="text-sm text-gray-600">₦{product?.base_price}</p>
            <div className="flex items-center gap-2">
              <div className="flex items-center" aria-hidden>
                {stars.map((t, i) => (
                  <span key={i} className="inline-flex">
                    <Star type={t} gradId={gradId} />
                  </span>
                ))}
              </div>
              <span className="text-sm text-gray-600">
                ({product?.reviews?.rating?.toFixed(1)})
              </span>
            </div>
          </CardContent>
          <CardFooter className="w-full my-2 px-0">
            <Link
              className="block  w-full"
              href={`/app/products/${product?.id}`}
            >
              <Button variant={"outline"} className="w-full cursor-pointer">
                Custom Order
              </Button>
            </Link>
            <Link
              className="block  w-full"
              href={`/app/products/${product?.id}`}
            >
              <Button className="w-full cursor-pointer">
                Buy Now
              </Button>
            </Link>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
};

export default ProductCard;