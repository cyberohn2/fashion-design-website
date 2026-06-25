"use client"
import { ProductType } from "@/components/app-components/catalog/product-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Edit, Eye, Trash2, ZapOff } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const DressCard = ({dress}: {dress: ProductType & {isPublished?: boolean}}) => {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const updateDress = async () => {
    const req = await fetch("/api/admin/dress/update", {
      method: "POST",
      body: JSON.stringify({
        dressId: dress.id,
        title: dress.title,
        description: dress.description,
        category: dress.category,
        gender: dress.gender,
        base_price: dress.base_price,
        stock: dress.stock,
        isPublished: dress.isPublished ? false : true,
      }),
    });

    // check request is okay
    if (req.ok) {
      setIsSubmitting(false);
      router.refresh();
    } else {
      const errorData = await req.json();
      toast.error(errorData.error, {
        position: "top-right"
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div>
      <Card>
        <CardContent className="flex items-start flex-col md:flex-row justify-between">
          <div className="flex gap-4 flex-col items-start md:flex-row">
            <Image
              src={
                (dress?.thumbnail
                  ? dress.thumbnail
                  : dress.images && dress?.images[0]?.url) as string
              }
              alt="dress-image"
              width={100}
              height={100}
            />
            <div className="space-y-4">
              <h2 className="font-bold text-xl ">{dress.title}</h2>
              <p>{dress.description}</p>
              <div className="flex items-center gap-2">
                <Button onClick={() => router.push(`/catalog/${dress.slug}`)}>
                  <Eye /> View
                </Button>
                <Button
                  variant={"outline"}
                  onClick={() =>
                    router.push(`/admin/products/edit/${dress.slug}`)
                  }
                >
                  <Edit /> Edit
                </Button>
                <Button
                  disabled={isSubmitting}
                  onClick={updateDress}
                  variant={"secondary"}
                >
                  <ZapOff />
                  {dress.isPublished ? "Unpublish" : "Publish"}
                </Button>
              </div>
            </div>
          </div>
          <div>
            <p>
              <span className="font-bold">Sales:</span> {dress.soldCount}
            </p>
            <p>
              <span className="font-bold">Revenue:</span> ₦
              {dress.soldCount * dress.base_price}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DressCard;
