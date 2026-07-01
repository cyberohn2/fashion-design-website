"use client"
import { useState } from "react";
import { Star, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { DressType } from "./dress-card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { NewOrderDialog } from "./new-order-dialog";

const DressPage = ({ dress }: { dress: DressType | null }) => {
  const [quantity, setQuantity] = useState(1);

  const averageRating =
    dress?.reviews &&
    dress?.reviews?.reduce((sum, review) => sum + review?.rating, 0) /
      dress?.reviews?.length;

  const getCategoryLabel = (category: string) => {
    const labels: { [key: string]: string } = {
      FEMALE_NATIVE: "Female Native",
      MALE_NATIVE: "Male Native",
      CORPORATE_MALE: "Corporate Male",
      CORPORATE_FEMALE: "Corporate Female",
      CASUAL: "Casual",
      STREET_WEAR: "Street Wear",
    };
    return labels[category] || category;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-light tracking-wide">{dress?.title}</h1>
        </div>
      </header>

      {/* Main Dress Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {dress?.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-square bg-gray-50 overflow-hidden rounded-lg">
                      <img
                        src={image.url}
                        alt={`${dress?.title} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2 bg-white/90 hover:bg-white text-black border-0" />
              <CarouselNext className="right-2 bg-white/90 hover:bg-white text-black border-0" />
            </Carousel>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {dress?.images?.map((image, index) => (
                <button
                  key={index}
                  className="aspect-square overflow-hidden rounded-lg opacity-60 hover:opacity-100 transition-all ring-offset-0 hover:ring-2 hover:ring-black"
                >
                  <img
                    src={image.url}
                    alt={`Dress ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Dress Details */}
          <div className="flex flex-col justify-start space-y-6">
            {/* Category and Title */}
            <div>
              <p className="text-sm font-light text-gray-600 uppercase tracking-widest">
                {getCategoryLabel(dress?.category as string)}
              </p>
              <h1 className="text-4xl font-light mt-2">{dress?.title}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.round(averageRating as number)
                        ? "fill-black text-black"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {averageRating?.toFixed(1)} ({dress?.reviews?.length} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-light">
                  ₦{dress?.base_price}
                </span>
                <span className="text-sm text-gray-500">NGN</span>
              </div>
              <p className="text-sm text-gray-600">
                {dress?.stock && dress?.stock > 0 ? (
                  <span className="text-green-700">
                    In stock ({dress?.stock} available)
                  </span>
                ) : (
                  <span className="text-red-600">Out of stock</span>
                )}
              </p>
            </div>

            {/* Description */}
            <p className="text-gray-700 leading-relaxed">
              {dress?.description}
            </p>

            {/* Dress Info */}
            <div className="space-y-4">
              <Separator />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                    Gender
                  </p>
                  <p className="font-light">{dress?.gender}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-gray-600 mb-1">
                    Category
                  </p>
                  <p className="font-light">
                    {getCategoryLabel(dress?.category as string)}
                  </p>
                </div>
              </div>
              <Separator />
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm uppercase tracking-widest text-gray-600">
                  Quantity
                </label>
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) =>
                      setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                    }
                    className="w-12 text-center font-light bg-transparent border-none outline-none"
                    min="1"
                    max={dress?.stock}
                  />
                  <button
                    onClick={() =>
                      setQuantity(Math.min(dress?.stock || 1, quantity + 1))
                    }
                    className="px-3 py-2 text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Dialog>
                  <DialogTrigger>
                    <Button
                      className="flex-1 bg-black text-white hover:bg-gray-800 py-3 font-light tracking-wide"
                      disabled={dress?.stock === 0}
                    >
                      Buy Now
                    </Button>
                  </DialogTrigger>
                  <NewOrderDialog dress={dress as DressType} />
                </Dialog>
                <Button
                  variant="outline"
                  className="flex-1 py-3 font-light tracking-wide"
                  disabled={dress?.stock === 0}
                >
                  Custom Order
                </Button>
                <Button variant="ghost" size="icon" className="px-4">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-20 pt-12">
          <Separator className="mb-12" />
          <h2 className="text-2xl font-light mb-8">Customer Reviews</h2>

          <div className="space-y-6">
            {dress?.reviews?.length === 0 ? (
              <p>There are no reviews for this dress yet!.</p>
            ) : (
              dress?.reviews?.map((review) => (
                <Card key={review.id} className="border-0 bg-gray-50">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < review.rating
                                  ? "fill-black text-black"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 leading-relaxed">
                      {review.comment}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DressPage;
