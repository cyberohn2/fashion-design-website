"use client"
import { createAddress, type CreateAddressData } from "@/actions/addresses/create-address"
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
import { getAddress } from "@/actions/addresses/get-address";
import { updateAddress } from "@/actions/addresses/update-address";

const AddressForm = () => {
    const [formData, setFormData] = useState<CreateAddressData>({
        fullName: "",
        phone: "",
        country: "",
        state: "",
        city: "",
        address: "",
        postalCode: "",
        isDefault: false,
    });

    const params = useParams();
    useEffect(() => {
        if (params.id) {
        getAddress(params.id as string).then((val) =>
          setFormData({
            fullName: val.full_name,
            phone: val.phone,
            country: val.country,
            state: val.state,
            city: val.city,
            address: val.address,
            postalCode: val.postal_code as string | undefined,
            isDefault: val.is_default as boolean | undefined,
          }),
        );
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
        let newAddress;
        if (params.id) {
            newAddress = await updateAddress({...formData, addressId: params.id as string})
        } else {
            newAddress = await createAddress(formData);    
        } 
        
        if (newAddress) {
            setIsSubmitting(false)
            router.push("/addresses/manage")
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
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
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
              value={formData.postalCode}
              onChange={handleInputChange}
              placeholder="Enter Postal Code"
              className="mt-2"
              required
            ></Textarea>
          </div>

          <div className="flex gap-2 items-center mb-2">
            <Checkbox
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isDefault: checked ? true : false,
                }))
              }
            />
            <Label htmlFor="isDefault">Set as default Address</Label>
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
