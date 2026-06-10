"use client";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Edit, Eye, SearchSlash } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export type measurement = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  profile_name: string;
  gender: string;
  chest: number;
  waist: number;
  hips: number;
  shoulder: number;
  sleeve_length: number;
  arm: number | null;
  sleeve_hem: number | null;
  top_length: number | null;
  thigh: number;
  trouser_length: number;
  ankle: number;
  waist_to_knee: number;
  knee_to_ankle: number;
  round_knee: number;
  inseam: number | null;
  neck: number;
  height: number | null;
  notes: string | null;
};

export default function ManageMeasurements({measurements}: {measurements: measurement[]}) {
  const router = useRouter();

  return (
    <div className="px-4 container mx-auto">
      <div className="mb-4 border-b pb-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
          Manage Measurements
        </h1>
        <Link href={"/measurements/new"}><Button>+ Add New</Button></Link>
      </div>
      <div>
        <div className="space-y-3 mt-8 min-h-screen">
          {measurements?.length !== 0 ? (
            measurements?.map((measurement) => (
              <div
                key={measurement.id}
                className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-sm text-foreground line-clamp-1">
                      {measurement.profile_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Link href={`/measurements/edit/${measurement.id}`}>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <SearchSlash />
                </EmptyMedia>
                <EmptyTitle>Nothing here!</EmptyTitle>
                <EmptyDescription>
                  You don't have any measurements yet.
                  <Link href={"/measurements/new"}>Create New Measurement</Link>
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}