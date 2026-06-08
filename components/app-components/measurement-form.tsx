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
import { createMeasurement, type CreateMeasurementData } from "@/actions/measurements/create-measurement";
import { getMeasurement } from "@/actions/measurements/get-measurement";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { updateMeasurement } from "@/actions/measurements/update-measurement";

const MeasurementForm = () => {
    const [formData, setFormData] = useState<CreateMeasurementData>({
      profileName: "",
      gender: "MALE",
      chest: 0,
      waist: 0,
      hips: 0,
      shoulder: 0,
      sleeveLength: 0,
      arm: 0,
      sleeveHem: 0,
      topLength: 0,
      thigh: 0,
      trouserLength: 0,
      ankle: 0,
      waistToKnee: 0,
      kneeToAnkle: 0,
      roundKnee: 0,
      neck: 0,
      inseam: 0,
      height: 0,
      notes: "",
    });

    const params = useParams();
    useEffect(() => {
        if (params.id) {
        getMeasurement(params.id as string).then((data) =>
          setFormData({
            profileName: data.profile_name,
            gender: data.gender,
            chest: data.chest,
            waist: data.waist,
            hips: data.hips,
            shoulder: data.shoulder,
            sleeveLength: data.sleeve_length,
            arm: data.arm as number | undefined,
            sleeveHem: data.sleeve_hem as number | undefined,
            topLength: data.top_length as number | undefined,
            thigh: data.thigh,
            trouserLength: data.trouser_length,
            ankle: data.ankle,
            waistToKnee: data.waist_to_knee,
            kneeToAnkle: data.knee_to_ankle,
            roundKnee: data.round_knee,
            neck: data.neck,
            inseam: data.inseam as number | undefined,
            height: data.height as number | undefined,
            notes: data.notes as string | undefined,
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
        let newMeasurement;
        if (params.id) {
            newMeasurement = await updateMeasurement({
            ...formData,
            measurementId: params.id as string,
            });
        }else{
            newMeasurement = await createMeasurement(formData)
        }
        if (newMeasurement) {
          setIsSubmitting(false);
          router.push("/measurements/manage");
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
      <p className="font-semibold text-red-500">
        {formError && `An error occured: ${formError}`}
      </p>

      {/* Profile name Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Name</CardTitle>
          <CardDescription>What's this measurement for ?</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          <div className="">
            <Label htmlFor="profileName">Profile Name *</Label>
            <Input
              id="profileName"
              name="profileName"
              type="text"
              value={formData.profileName}
              onChange={handleInputChange}
              placeholder="e.g. senator measurement"
              className="mt-2"
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Gender Section */}
      <Card>
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
      </Card>

      {/* Phone Section */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
          {Object.entries(formData).map(
            ([key, value]) =>
              (key !== "profileName" || "gender" || "notes") && (
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
              ),
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>
            Add instructions for this measurement
          </CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-1">
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

export default MeasurementForm
