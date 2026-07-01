"use client";
import { type SubmitEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { CreateDressData } from "@/actions/admin/create-dress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ImageUploader from "@/components/ui/image-uploader";
import { updateDressImage } from "@/lib/supabase/update-dress-image";
import { RotateCcw } from "lucide-react";
import { toast } from "sonner";

type imagesurls = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  url: string;
  storagePath: string;
  dressId: string;
};

type dressDataType = CreateDressData & {id: string, imagesUrl?: imagesurls[], isPublished?: boolean}

const CreateDressForm = ({
  dressData,
}: {
  dressData?: dressDataType | null;
}) => {
  const [formData, setFormData] = useState<dressDataType>(
    dressData || {
      id: "",
      title: "",
      description: "",
      category: "",
      type: "",
      gender: "",
      basePrice: 0,
      stockQuantity: 0,
      images: undefined,
      imagesUrl: []
    }
  );

  const router = useRouter();

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev: dressDataType) => ({ ...prev, [name]: value }));
  };

  const [ imageUploading, setImageUploading ] = useState(false)
  const handleImageChange = async (files: File[]) => {
    if (!dressData){
        setFormData(prev => ({...prev, images: files}))
        return
    }else {
        setImageUploading(true)
        const uploadedImages = await Promise.all(
          files.map((file) =>
            updateDressImage({
              file: file,
              filePath: "",
            }),
          ),
        ).then(
            ()=>setImageUploading(false), 
            () => {
                setFormError("Error while uploading Image.")
                setImageUploading(false)
            });
    }
  }

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // update address if dressData is present
      if (dressData) {
        const req = await fetch("/api/admin/dress/update", {
          method: "POST",
          body: JSON.stringify({
            dressId: formData.id,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            type: formData.type,
            gender: formData.gender,
            base_price: formData.basePrice,
            stock: formData.stockQuantity,
            isPublished: formData.isPublished,
          }),
        });

        // check request is okay
        if (req.ok) {
          setIsSubmitting(false);
          toast.success("Updated Successfully!");
          router.push("/admin/dresses");
        } else {
          const errorData = await req.json();
          setFormError(errorData.error || "Failed to update address");
          setIsSubmitting(false);
        }
      } else {
        // else we create a new one
        // but first we put formdata inside a new FormData
        const formDataToSend = new FormData();
        formDataToSend.append("title", formData.title);
        formDataToSend.append("description", formData.description);
        formDataToSend.append("category", formData.category);
        formDataToSend.append("type", formData.type);
        formDataToSend.append("gender", formData.gender);
        formDataToSend.append("basePrice", String(formData.basePrice));
        formDataToSend.append("stock", String(formData.stockQuantity));
        formData.images?.map(
          (_, i) =>
            formData.images &&
            formDataToSend.append("images", formData.images[i]),
        );

        const req = await fetch("/api/admin/dress/create", {
          method: "POST",
          body: formDataToSend,
        });
        if (req.ok) {
          setIsSubmitting(false);
          router.push("/admin/dresses");
        } else {
          const errorData = await req.json();
          setIsSubmitting(false);
          setFormError(errorData.error || "Failed to update dress");
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setFormError(
        `Error ${dressData ? "updating" : "creating"} dress:${message}`,
      );
      console.error(
        `Error ${dressData ? "updating" : "creating"} dress:`,
        message,
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <div className="mb-4 border-b pb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
          New Dress
        </h1>
      </div>
      <p className="font-semibold text-red-500">
        {formError && `An error occured: ${formError}`}
      </p>
      {/* Images section */}
      {!dressData ? (
        <Card>
          <CardHeader>
            <CardTitle>Dress Images</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-1">
            <ImageUploader
              disabled={imageUploading}
              maxFiles={5}
              onImagesChange={(files) => handleImageChange(files)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {dressData.imagesUrl?.map((image, index) => (
            <div key={index} className="relative group">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-muted">
                <img
                  src={image.url}
                  alt={`Preview ${index}`}
                  className="object-cover"
                />
              </div>
              <label
                htmlFor="image-input"
                className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded"
              >
                <RotateCcw className="h-4 w-4 text-white" />
              </label>
              <input
                onChange={(e) =>
                  handleImageChange(Array.from(e.target.files as FileList))
                }
                id="image-input"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
              />
            </div>
          ))}
        </div>
      )}

      {/* Title Section */}
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Agbada"
              className="mt-2"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>Description</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Premium style agbada for men"
              className="mt-2"
              required
            ></Textarea>
          </div>
        </CardContent>
      </Card>

      {/* Category Section */}
      <Card>
        <CardHeader>
          <CardTitle>Category & Gender</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="category">Category *</Label>
            <Select
              required
              value={formData.category}
              onValueChange={(value) =>
                setFormData((prev: dressDataType) => ({
                  ...prev,
                  category: value,
                }))
              }
            >
              <SelectTrigger id="category" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="FEMALE_NATIVE">Female Native</SelectItem>
                <SelectItem value="MALE_NATIVE">Male Native</SelectItem>
                <SelectItem value="CORPORATE_MALE">Corporate Male</SelectItem>
                <SelectItem value="CORPORATE_FEMALE">
                  Corporate Female
                </SelectItem>
                <SelectItem value="CASUAL">Casual</SelectItem>
                <SelectItem value="STREET_WEAR">Street Wear</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <Label htmlFor="gender">Gender *</Label>
            <Select
              required
              value={formData.gender}
              onValueChange={(value) =>
                setFormData((prev: dressDataType) => ({
                  ...prev,
                  gender: value,
                }))
              }
            >
              <SelectTrigger id="gender" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="UNISEX">Unisex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="">
            <Label htmlFor="type">Type *</Label>
            <Select
              required
              value={formData.type}
              onValueChange={(value) =>
                setFormData((prev: dressDataType) => ({
                  ...prev,
                  type: value,
                }))
              }
            >
              <SelectTrigger id="type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BESPOKE">Bespoke</SelectItem>
                <SelectItem value="KAFTAN">Kaftan</SelectItem>
                <SelectItem value="MONOGRAM">Monogram</SelectItem>
                <SelectItem value="NATIVE">Native</SelectItem>
                <SelectItem value="READYMADE">Ready Made</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Pricing and Stock Section */}
      <Card>
        <CardHeader>
          <CardTitle>Pricing and Stock Quantity *</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="price">Price *</Label>
            <Input
              id="basePrice"
              name="basePrice"
              type="text"
              value={formData.basePrice}
              onChange={handleInputChange}
              placeholder="0"
              className="mt-2"
              required
            />
          </div>

          <div className="">
            <Label htmlFor="stockQuantity">Stock Quantity *</Label>
            <Input
              id="stockQuantity"
              name="stockQuantity"
              type="text"
              value={formData.stockQuantity}
              onChange={handleInputChange}
              placeholder="0"
              className="mt-2"
              required
            />
          </div>
        </CardContent>
      </Card>

      <p className="font-semibold text-red-500">
        {formError && `An error occured: ${formError}`}
      </p>

      {/* Submit Button */}
      <div className="flex gap-4">
        <Button
          disabled={isSubmitting}
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90"
          size="lg"
        >
          {isSubmitting
            ? dressData
              ? "Updating"
              : "Creating..."
            : dressData
              ? "Update Dress"
              : "Create Dress"}
        </Button>
      </div>
    </form>
  );
};

export default CreateDressForm;
