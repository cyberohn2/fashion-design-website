"use client"
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Edit, Eye, SearchSlash } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator"
import { ArrowLeft } from "lucide-react"

export type address = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  full_name: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postal_code: string | null;
  is_default: boolean | null;
};

export default function ManageAddresses({addresses}: {addresses: address[]}) {
  const router = useRouter()
  console.log(addresses)

  return (
    <div className="px-4 py-6 container mx-auto">
      <div>
        <div className="mb-6">
          <Button
            onClick={() => router.back()}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tighter">
            Saved Addresses
          </h1>
        </div>
      </div>
      <div className="space-y-3 p-4 mt-8 min-h-screen">
        {addresses?.length !== 0 ? (
          addresses?.map((address) => (
            <div
              key={address.id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border border-border hover:bg-accent transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-medium text-sm text-foreground line-clamp-1">
                    {address.address}
                  </p>
                  {address.is_default && (
                    <Badge variant={"secondary"}>Default</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost">Set as default</Button>
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
                You don't have any address yet.
                <Link href={"/addresses/new"}>Create New Address</Link>
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </div>
    </div>
  );
}


