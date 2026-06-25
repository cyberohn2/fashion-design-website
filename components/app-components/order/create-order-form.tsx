"use client"
import { type CreateFullCustomOrderData } from "@/actions/orders/create-full-custom-order";
import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ImageUploader from "@/components/ui/image-uploader";
import Link from "next/link";
import { type address } from "@/components/app-components/address/manage-address";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { uploadImage } from "@/lib/supabase/upload-image";
import { measurement } from "../measurement/manage-measurements";

const CreateOrderForm = () => {
  const [formData, setFormData] = useState<(CreateFullCustomOrderData & {selectedDressId?: string, materialChoice?: string, customMaterialNotes?: string})>({
    ideaImageUrl: "",
    deliveryMethod: "PICKUP",
    deliveryAddressId: undefined,
    measurementProfileId: undefined,
    customizationNotes: "",
    customerBudget: undefined,
  });
  const [ideaImageFile, setIdeaImageFile] = useState<File | null>(null);

  const [loading, setIsLoading] = useState<boolean>(true)

  const [addresses, setAddresses] = useState<address[]>();
  const [measurements, setMeasurements] = useState<measurement[]>();

  const router = useRouter()
  const params = useParams();
  // fetch selected dress details if custom order
  useEffect(()=>{
    const fetchDress = async () => {
      const req = await fetch(`/api/dresses/${params.slug}`);
      if (req.ok) {
        req
          .json()
          .then((val) =>
            setFormData((prev) => ({
              ...prev,
              selectedDressId: val?.id,
              ideaImageUrl: val?.images[0]?.url,
            })),
          );
      }
    };

    const fetchAddresses = async () => {
      const req = await fetch(`/api/address/get-address`);
      if(req.ok){
        req.json().then( data => setAddresses(data))
      }
    }

    const fetchMeasurements = async () => {
      const req = await fetch(`/api/measurements/get-measurement`);
      if (req.ok) {
        req.json().then((data) => setMeasurements(data));
        setIsLoading(false);
      } else {
        const errorData = await req.json();
        setFormError(errorData.error || "Failed to get measurement data");
        setIsLoading(false);
      }
    }

    if(params.slug){
      fetchDress()
    }

    fetchAddresses()
    fetchMeasurements()
  }, [params.slug])

  const [formError, setFormError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImagesChange = async (files: File[]) => {
    if (files.length > 0) {
      setIdeaImageFile(files[0]);
    }
  };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("");

    try {
      // upload image to supabase and get url
      if(ideaImageFile){
        const imageUrl = await uploadImage(ideaImageFile);
        setFormData((prev) => ({ ...prev, ideaImageUrl: imageUrl }));
      }

      // create semi-custom order if param.slug and selectedDressId is available 
      if (params.slug && formData.selectedDressId) {
        const formDataToSubmit = {
          ...formData,
          selectedDressId: formData.selectedDressId,
        }
        const req = await fetch(`/api/custom-orders/semi-custom`, {
          method: "POST",
          body: JSON.stringify({data: formDataToSubmit}),
        });
        if (req.ok) { 
          // move on to payment
          setIsSubmitting(false);
          router.push("/catalog");
        } else {
          const errorData = await req.json();
          setFormError(errorData.error || "Failed to create order");
          setIsSubmitting(false);
        }
      }else{
        const req = await fetch(`/api/custom-orders`, {
          method: "POST",
          body: JSON.stringify({data: formData}),
        });
        if (req.ok) {
          // move on to payment
          setIsSubmitting(false);
          router.push("/catalog");
        } else {
          const errorData = await req.json();
          setFormError(errorData.error || "Failed to create order");
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setFormError(
        `Error creating order:${message}`,
      );
    }
  }

  return (
    <form
      aria-disabled={loading}
      onSubmit={handleSubmit}
      className="space-y-6 "
    >
      <p className="font-semibold text-red-500">
        {formError && `An error occured: ${formError}`}
      </p>
      {/* Images Section */}
      <section>
        <Label className="text-base font-semibold text-foreground">
          Product Images
        </Label>
        <div className="mt-4">
          {params.slug? (
            <Image
              width={200}
              height={200}
              src={formData.ideaImageUrl}
              alt="image"
            />
          ) : (
            <ImageUploader maxFiles={1} onImagesChange={handleImagesChange} />
          )}
        </div>
      </section>

      {/* Delivery Section */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Method</CardTitle>
          <CardDescription>How do you want us to deliver</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-1">
          <div>
            <Label htmlFor="type">Delivery Method *</Label>
            <Select
              disabled={loading}
              required
              value={formData.deliveryMethod}
              onValueChange={(value) =>
                handleSelectChange("deliveryMethod", value)
              }
            >
              <SelectTrigger id="type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PICKUP">Pick Up</SelectItem>
                <SelectItem value="LOCAL_DELIVERY">Home Delivery</SelectItem>
                <SelectItem value="SHIPPING">Shipping</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Delivery Address Section */}
      {formData.deliveryMethod === "LOCAL_DELIVERY" && (
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>What's your address</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-1">
            <div>
              <Label htmlFor="type">Address *</Label>
              <Select
                disabled={loading}
                required
                value={formData.deliveryAddressId}
                onValueChange={(value) =>
                  handleSelectChange("deliveryAddressId", value)
                }
              >
                <SelectTrigger id="type" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {addresses?.map((address) => (
                    <SelectItem value={address.id}>
                      {address.address}
                    </SelectItem>
                  ))}
                  <Link href={"/address/new"}>Add New Address</Link>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Measurement Section */}
      <Card>
        <CardHeader>
          <CardTitle>Measurements</CardTitle>
          <CardDescription>Input Measurements</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-1">
          <div>
            <Label htmlFor="type">Select Measurements *</Label>
            <Select
              disabled={loading}
              required
              value={formData.measurementProfileId}
              onValueChange={(value) =>
                handleSelectChange("measurementProfileId", value)
              }
            >
              <SelectTrigger id="type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {measurements?.map((measurement) => (
                  <SelectItem value={measurement.id}>
                    {measurement.profile_name}
                  </SelectItem>
                ))}
                <Link href={"/measurements/new"}>Add New Measurement</Link>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Customization Notes Section */}
      <Card>
        <CardHeader>
          <CardTitle>Customization Notes</CardTitle>
          <CardDescription>
            Provide any specific instructions or notes for customizing your
            order
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Label htmlFor="customizationNotes">Customization Notes</Label>
          <Textarea
            disabled={loading}
            id="customizationNotes"
            name="customizationNotes"
            value={formData.customizationNotes}
            onChange={handleInputChange}
            placeholder="Enter any specific instructions or notes for customizing your order..."
            className="mt-2"
          />
        </CardContent>
      </Card>

      {/* Budget Section */}
      <Card>
        <CardHeader>
          <CardTitle>Budget (Optional)</CardTitle>
          <CardDescription>
            How much are you willing to spend for this order?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="stateFee">Budget</Label>
            <Input
              disabled={loading}
              id="customerBudget"
              name="customerBudget"
              type="text"
              value={formData.customerBudget}
              onChange={handleInputChange}
              placeholder="0.00"
              className="mt-2"
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
          {isSubmitting ? "Submitting..." : "Create Order"}
        </Button>
        <Button
          disabled={isSubmitting}
          type="button"
          variant="outline"
          size="lg"
        >
          Save as Draft
        </Button>
      </div>
    </form>
  );
}

export default CreateOrderForm
