import { CheckCircle2, LoaderCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export type PaymentStatusCardProp = "success" | "pending" | "failed";

export function PaymentStatusCard({ status }: { status: PaymentStatusCardProp }) {
  const config = {
    success: {
      icon: CheckCircle2,
      color: "text-green-600",
      title: "Payment Successful",
      description: "Your payment has been confirmed.",
      button: "Continue",
    },
    pending: {
      icon: LoaderCircle,
      color: "text-blue-600",
      title: "Payment Pending",
      description: "We're waiting for payment confirmation.",
      button: "Refresh Status",
    },
    failed: {
      icon: XCircle,
      color: "text-red-600",
      title: "Payment Failed",
      description: "Your payment could not be completed.",
      button: "Try Again",
    },
  }[status];

  const Icon = config.icon;

  const router = useRouter();
  const handleAction = (status: "success" | "pending" | "failed") => {
    if (status === "success") {
      router.push("/order-history");
    } else if (status === "pending") {
      router.refresh();
    } else {
      router.back();
    }
  };

  return (
    <Card className="mx-auto max-w-md">
      <CardContent className="flex flex-col items-center gap-4 py-10 text-center">
        <Icon
          className={`h-16 w-16 ${config.color} ${
            status === "pending" ? "animate-spin" : ""
          }`}
        />

        <div>
          <h2 className="text-2xl font-semibold">{config.title}</h2>
          <p className="mt-2 text-muted-foreground">{config.description}</p>
        </div>

        <Button
          variant={status === "pending" ? "outline" : "default"}
          onClick={() => handleAction(status)}
        >
          {config.button}
        </Button>
      </CardContent>
    </Card>
  );
}
