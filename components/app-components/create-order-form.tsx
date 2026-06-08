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
import ImageUploader from "../ui/image-uploader";
import { FieldDescription } from "../ui/field";
import Link from "next/link";
import { type address } from "@/components/app-components/manage-address";
import { getAddresses } from "@/actions/addresses/get-addresses";
import { measurement } from "./manage-measurements";
import { getMeasurements } from "@/actions/measurements/get-measurements";

const CreateOrderForm = () => {
    const [formData, setFormData] = useState<CreateFullCustomOrderData>({
        ideaImageUrl: "",
        deliveryMethod: "PICKUP",
        deliveryAddressId: undefined,
        measurementProfileId: undefined,
        customizationNotes: "",
        customerBudget: undefined,
    });
    const [addresses, setAddresses] = useState<address[]>();
    const [measurements, setMeasurements] = useState<measurement[]>();


    useEffect(() => {
        getAddresses().then((val) => (setAddresses(val)));
        getMeasurements().then(val => setMeasurements(val))
    }, [])

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

    const handleImagesChange = (files: File[]) => {
        if (files.length > 0) {
            const imageUrl = URL.createObjectURL(files[0]);
            setFormData((prev) => ({ ...prev, ideaImageUrl: imageUrl }));
        }
    };

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <p className="font-semibold text-red-500">
        {formError && `An error occured: ${formError}`}
      </p>
      {/* Images Section */}
      <section>
        <Label className="text-base font-semibold text-foreground">
          Product Images
        </Label>
        <p className="mt-1 text-sm text-muted-foreground">Upload image</p>
        <div className="mt-4">
          <ImageUploader maxFiles={1} onImagesChange={handleImagesChange} />
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
              id="customerBudget"
              name="customerBudget"
              type="text"
              value={formData.customerBudget}
              onChange={handleInputChange}
              placeholder="0.00"
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
