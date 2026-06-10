"use client"
import { type CreateAddressData } from "@/actions/addresses/create-address"
import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "../ui/checkbox";
import { useParams, useRouter } from "next/navigation";

const AddressForm = () => {
    const [formData, setFormData] = useState<CreateAddressData>({
        full_name: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postal_code: "",
        is_default: false,
    });

    // fetch address data if user is updating an address data
    const params = useParams();
    useEffect(() => {
      if (params.id) {
        const fetchAddress = async () => {
          try {
            const req = await fetch(`/api/address/get-address/${params.id}`);
            if (req.ok) {
              req.json().then((data) =>
                setFormData({
                  full_name: data.full_name,
                  phone: data.phone,
                  country: data.country,
                  state: data.state,
                  city: data.city,
                  address: data.address,
                  postal_code: data.postal_code as string | undefined,
                  is_default: data.is_default as boolean | undefined,
                }),
              );
            }
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            setFormError(`Error getting address details: ${message}`)
          }
        }

        fetchAddress();
      }
    }, [params.id]);


    const router = useRouter()

    const [formError, setFormError] = useState<string | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // update address if params.id is present else create a new one
      if (params.id) {
        const req = await fetch("/api/address/update-address", {
          method: "POST",
          body: JSON.stringify({
            ...formData,
            addressId: params.id as string,
          }),
        })
        if (req.ok) {
          setIsSubmitting(false);
          router.push("/addresses/manage");
        } else {
          const errorData = await req.json();
          setFormError(errorData.error || "Failed to update address");
          setIsSubmitting(false);
        }
      } else {
        const req = await fetch("/api/address/create-address", {
          method: "POST",
          body: JSON.stringify({formData})
        })
        if (req.ok) {
          setIsSubmitting(false);
          router.push("/addresses/manage");
        } else {
          const errorData = await req.json();
          setFormError(errorData.error || "Failed to update address");
          setIsSubmitting(false);
        }
      } 
    } catch (error) {
        const message =
        error instanceof Error ? error.message : String(error);
        setFormError(`Error ${params.id ? "updating" : "creating"} address:${message}`);
        console.error(`Error ${params.id ? "updating" : "creating"} address:`, message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <div className="mb-4 border-b pb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
          New Measurement Profile
        </h1>
      </div>
      <p className="font-semibold text-red-500">
        {formError && `An error occured: ${formError}`}
      </p>
      {/* Full name Section */}
      <Card>
        <CardHeader>
          <CardTitle>Full Name</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              value={formData.full_name}
              onChange={handleInputChange}
              placeholder="John Doe Appleseed"
              className="mt-2"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Phone Section */}
      <Card>
        <CardHeader>
          <CardTitle>Phone Number</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="+234 901 234 5678"
              className="mt-2"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Phone Section */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="country">Country *</Label>
            <Input
              id="country"
              name="country"
              type="text"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="e.g. Nigeria"
              className="mt-2"
              required
            />
          </div>

          <div className="">
            <Label htmlFor="state">State *</Label>
            <Input
              id="state"
              name="state"
              type="text"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="e.g. Ondo"
              className="mt-2"
              required
            />
          </div>

          <div className="">
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              name="city"
              type="text"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g. Akure"
              className="mt-2"
              required
            />
          </div>

          <div className="row-start-2 col-span-2">
            <Label htmlFor="address">Adddress Line *</Label>
            <Textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter full address"
              className="mt-2"
              required
            ></Textarea>
          </div>

          <div className="">
            <Label htmlFor="postalCode">Postal Code (Optional)</Label>
            <Textarea
              id="postalCode"
              name="postalCode"
              value={formData.postal_code}
              onChange={handleInputChange}
              placeholder="Enter Postal Code"
              className="mt-2"
              required
            ></Textarea>
          </div>

          <div className="flex gap-2 items-center mb-2">
            <Checkbox
              id="is_default"
              name="is_default"
              checked={formData.is_default}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  is_default: checked ? true : false,
                }))
              }
            />
            <Label htmlFor="is_default">Set as default Address</Label>
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
          {isSubmitting ? "Submitting..." : "Create Address"}
        </Button>
      </div>
    </form>
  );
}

export default AddressForm
