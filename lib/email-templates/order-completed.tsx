import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type OrderCompletedProps = {
  customerName: string;
  orderNumber: string;
  delivery: boolean;
};

export default function OrderCompletedEmail({
  customerName,
  orderNumber,
  delivery,
}: OrderCompletedProps) {
  return (
    <Html>
      <Head />

      <Preview>
        {delivery
          ? "Your order is complete and will be delivered soon."
          : "Your order is complete and ready for pickup."}
      </Preview>

      <Body
        style={{
          margin: 0,
          backgroundColor: "#f5f5f5",
          fontFamily: "Arial, sans-serif",
          padding: "30px",
        }}
      >
        <Container
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Section
            style={{
              backgroundColor: "#0d6efd",
              padding: "25px",
              textAlign: "center",
            }}
          >
            <Heading
              style={{
                color: "#ffffff",
                margin: 0,
                fontSize: "28px",
              }}
            >
              Your Order Is Ready
            </Heading>
          </Section>

          {/* Content */}
          <Section
            style={{
              padding: "35px",
            }}
          >
            <Text>Hello {customerName},</Text>

            <Text>
              We're pleased to let you know that your order has been completed.
            </Text>

            <Hr />

            <Text>
              <strong>Order Number:</strong> {orderNumber}
            </Text>

            <Hr />

            {delivery ? (
              <Text>
                Your order is now ready for delivery. Our team will contact you
                shortly with delivery details.
              </Text>
            ) : (
              <Text>
                Your order is ready for pickup. Please visit our store during
                business hours to collect it.
              </Text>
            )}

            <Text style={{ marginTop: "32px" }}>
              Thank you for shopping with us. We hope to serve you again soon.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
