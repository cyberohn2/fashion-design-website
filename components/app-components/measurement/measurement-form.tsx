"use client"
import { type SubmitEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import { type CreateMeasurementData } from "@/actions/measurements/create-measurement";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MeasurementForm = () => {
  const [formData, setFormData] = useState<CreateMeasurementData>({
    profile_name: "",
    gender: "MALE",
    chest: 0,
    waist: 0,
    hips: 0,
    shoulder: 0,
    sleeve_length: 0,
    arm: 0,
    sleeve_hem: 0,
    top_length: 0,
    thigh: 0,
    trouser_length: 0,
    ankle: 0,
    waist_to_knee: 0,
    knee_to_ankle: 0,
    round_knee: 0,
    neck: 0,
    inseam: 0,
    height: 0,
    notes: "",
  });

  const params = useParams();
  useEffect(() => {
    const fetchMeasurement = async () => {
      try {
        const req = await fetch(`/api/measurements/get-measurement/${params.id}`)
        if (req.ok) {
          req.json().then((data) => 
            setFormData(data)
          )
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        setFormError(`Error getting measurement details: ${message}`);
      }
    }
    if (params.id) {
      fetchMeasurement()
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

  const validateFormData = (): string | null => {
    for (const [key, value] of Object.entries(formData)) {
      if (value === "" || value === 0) {
        return `Field ${key} is required.`;
      }
    }
    return null;
  };

  const validateNumberFields = (): string | null => {
    const numberFields = [
      "chest",
      "waist",
      "hips",
      "shoulder",
      "sleeve_length",
      "arm",
      "sleeve_hem",
      "top_length",
      "thigh",
      "trouser_length",
      "ankle",
      "waist_to_knee",
      "knee_to_ankle",
      "round_knee",
      "neck",
      "inseam",
      "height"
    ];

    for (const field of numberFields) {
      const value = Number(formData[field as keyof CreateMeasurementData]);
      if (typeof value === "number" && value <= 0) {
        return `Field ${field} must be a positive number.`;
      }
    }
    return null;
  };

  const convertNumberFields = () => {
    Object.entries(formData).forEach(([key, value]) => {
      if (
        key !== "profile_name" &&
        key !== "gender" &&
        key !== "notes"
      ) {
        setFormData((prev) => ({ ...prev, [key]: Number(value) as number }));
      }
    });
  };


  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError("")
    convertNumberFields();

    const error = validateFormData();
    if (error) {
      setFormError(error);
      setIsSubmitting(false);
      return;
    }


    const numberError = validateNumberFields();
    if (numberError) {
      setFormError(numberError);
      setIsSubmitting(false);
      return;
    }

    try {
        if (params.id) {
          const req = await fetch("/api/measurements/update-measurement", {
            method: "POST",
            body: JSON.stringify({
              ...formData,
              measurementId: params.id as string,
            }),
          });
          if (req.ok) {
            setIsSubmitting(false);
            router.push("/measurements/manage");
          }else{
            const errorData = await req.json();
            setFormError(errorData.error || "Failed to update measurement");
            setIsSubmitting(false);
          }
        }else{
          const req = await fetch("/api/measurements/create-measurement", {
            method: "POST",
            body: JSON.stringify({formData}),
          });
          if (req.ok) {
            setIsSubmitting(false);
            router.push("/measurements/manage");
          }else{
            const errorData = await req.json();
            setFormError(errorData.error || "Failed to create measurement");
            setIsSubmitting(false);
          }
        }
    } catch (error) {
        const message =
            error instanceof Error ? error.message : String(error);
        setFormError(
          `Error ${params.id ? "updating" : "creating"} measurement:${message}`,
        );
        console.error(
          `Error ${params.id ? "updating" : "creating"} measurement:`,
          message,
        );
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
      <Card>
        {/* Profile name Section */}
        <div>
          <CardHeader>
            <CardTitle>Profile Name</CardTitle>
            <CardDescription>What's this measurement for ?</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-1">
            <div className="">
              <Label htmlFor="profile_name">Profile Name *</Label>
              <Input
                id="profile_name"
                name="profile_name"
                type="text"
                value={formData.profile_name}
                onChange={handleInputChange}
                placeholder="e.g. senator measurement"
                className="mt-2"
                required
              />
            </div>
          </CardContent>
        </div>
        {/* Gender Section */}
        <div>
          <CardHeader>
            <CardTitle>Gender</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-1">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select
                required
                value={formData.gender}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, gender: value }))
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
          </CardContent>
        </div>
        {/* Phone Section */}
        <div>
          <CardHeader>
            <CardTitle>Address</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 grid-cols-3 gap-1">
            {Object.entries(formData).map(([key, value]) => {
              if (
                key == "profile_name" || 
                key == "gender" || 
                key == "notes" ||
                key == "id" ||
                key == "createdAt" ||
                key == "updatedAt" ||
                key == "userId"
              ) {
                return null;
              } else {
                return (
                  <div className="">
                    <Label htmlFor={key}>{key} *</Label>
                    <Input
                      id={key}
                      name={key}
                      type="text"
                      value={value}
                      onChange={handleInputChange}
                      placeholder="0"
                      className="mt-2"
                      required
                    />
                  </div>
                );
              }
            })}
          </CardContent>
        </div>
        <div>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
            <CardDescription>
              Add instructions for this measurement
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-4 grid-cols-3 gap-1">
            <div className="">
              <Label htmlFor="notes">Notes *</Label>
              <Input
                id="notes"
                name="notes"
                type="text"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="What should we note about this measurement"
                className="mt-2"
                required
              />
            </div>
          </CardContent>
        </div>
        <p className="font-semibold text-red-500">
          {formError && `An error occured: ${formError}`}
        </p>
        {/* Submit Button */}
        <CardContent className="flex gap-4">
          <Button
            disabled={isSubmitting}
            type="submit"
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            {isSubmitting ? "Submitting..." : "Create Measurement"}
          </Button>
        </CardContent>
      </Card>
    </form>
  );
}

export default MeasurementForm
