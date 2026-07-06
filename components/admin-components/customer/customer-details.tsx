"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { customer } from "./customer-table";
import { measurement } from "@/components/app-components/measurement/manage-measurements";
import { userOrder } from "@/app/(customer)/order-history/page";
import { Payment } from "../order/order-details";

interface UserDetailsProps {
  user: customer & {
    addresses: Array<{ address: string }>;
    measurements: measurement[];
    orders: userOrder[];
    payments: (Payment & {order: userOrder})[];
  };
}

export function CustomerDetails({ user }: UserDetailsProps) {
  const [selectedMeasurement, setSelectedMeasurement] =
    useState<measurement | null>(null);

  const displayedOrders = user.orders.slice(0, 5);
  const displayedPayments = user.payments.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* User Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>User Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Full Name
              </p>
              <p className="text-lg font-semibold">{user.full_name}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-lg font-semibold">{user.phone}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Addresses Section */}
      <Card>
        <CardHeader>
          <CardTitle>Addresses</CardTitle>
        </CardHeader>
        <CardContent>
          {user.addresses && user.addresses.length > 0 ? (
            <div className="space-y-2">
              {user.addresses.map((address, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-secondary rounded-lg text-secondary-foreground"
                >
                  {address.address}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No addresses found</p>
          )}
        </CardContent>
      </Card>

      {/* Measurements Section */}
      <Card>
        <CardHeader>
          <CardTitle>Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          {user.measurements && user.measurements.length > 0 ? (
            <div className="space-y-2">
              {user.measurements.map((measurement) => (
                <Button
                  key={measurement.id}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setSelectedMeasurement(measurement)}
                >
                  <span>{measurement.profile_name}</span>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No measurements found</p>
          )}
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {user.orders && user.orders.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">
                        {order.order_number}
                      </TableCell>
                      <TableCell>{order.order_type}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{order.status}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {user.orders.length > 5 && (
                <Button variant="outline" className="w-full">
                  See All Orders
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No orders found for {user.full_name}</p>
          )}
        </CardContent>
      </Card>

      {/* Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Payments</CardTitle>
        </CardHeader>
        <CardContent>
          {user.payments && user.payments.length > 0 ? (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order Number</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Paid At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displayedPayments.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell className="font-medium">
                        {payment.order.order_number}
                      </TableCell>
                      <TableCell>${payment.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{payment.status}</Badge>
                      </TableCell>
                      <TableCell>
                        {payment.paidAt
                          ? new Date(payment.paidAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {user.payments.length > 5 && (
                <Button variant="outline" className="w-full">
                  See All Payments
                </Button>
              )}
            </div>
          ) : (
            <p className="text-muted-foreground">No payments found for {user.full_name}</p>
          )}
        </CardContent>
      </Card>

      {/* Measurement Details Dialog */}
      <Dialog
        open={!!selectedMeasurement}
        onOpenChange={() => setSelectedMeasurement(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedMeasurement?.profile_name} Measurements
            </DialogTitle>
          </DialogHeader>
          {selectedMeasurement && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Gender
                </p>
                <p className="font-semibold">{selectedMeasurement.gender}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Height
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.height
                    ? `${selectedMeasurement.height} inch(es)`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Chest
                </p>
                <p className="font-semibold">{selectedMeasurement.chest} inch(es)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Waist
                </p>
                <p className="font-semibold">{selectedMeasurement.waist} inch(es)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Hips
                </p>
                <p className="font-semibold">{selectedMeasurement.hips} inch(es)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Shoulder
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.shoulder} inch(es)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sleeve Length
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.sleeve_length} inch(es)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Arm</p>
                <p className="font-semibold">
                  {selectedMeasurement.arm
                    ? `${selectedMeasurement.arm} inch(es)`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Sleeve Hem
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.sleeve_hem
                    ? `${selectedMeasurement.sleeve_hem} inch(es)`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Top Length
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.top_length
                    ? `${selectedMeasurement.top_length} inch(es)`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Thigh
                </p>
                <p className="font-semibold">{selectedMeasurement.thigh} inch(es)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Trouser Length
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.trouser_length} inch(es)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Ankle
                </p>
                <p className="font-semibold">{selectedMeasurement.ankle} inch(es)</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Waist to Knee
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.waist_to_knee} inch(es)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Knee to Ankle
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.knee_to_ankle} inch(es)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Round Knee
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.round_knee} inch(es)
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Inseam
                </p>
                <p className="font-semibold">
                  {selectedMeasurement.inseam
                    ? `${selectedMeasurement.inseam} inch(es)`
                    : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Neck
                </p>
                <p className="font-semibold">{selectedMeasurement.neck} inch(es)</p>
              </div>
              {selectedMeasurement.notes && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Notes
                  </p>
                  <p className="font-semibold">{selectedMeasurement.notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
