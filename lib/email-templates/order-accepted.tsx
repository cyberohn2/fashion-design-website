import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

type OrderAcceptedEmailProps = {
  customerName: string;
  orderNumber: string;
  paymentUrl?: string;
  price?: number;
};

export default function OrderAcceptedEmail({
  customerName,
  orderNumber,
  paymentUrl,
  price
}: OrderAcceptedEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Your order has been accepted.</Preview>

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
              backgroundColor: "#198754",
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
              Your Order Has Been Accepted
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
              Great news! We've reviewed your order and it's been accepted.
            </Text>

            <Hr />

            <Text>
              <strong>Order Number:</strong> {orderNumber}
            </Text>

            <Hr />

            {paymentUrl ? (
              <>
                <Text>
                  To begin processing your order, please complete your payment
                  of ₦{price}
                  using the button below.
                </Text>

                <Section
                  style={{
                    textAlign: "center",
                    margin: "35px 0",
                  }}
                >
                  <Button
                    href={paymentUrl}
                    style={{
                      backgroundColor: "#111111",
                      color: "#ffffff",
                      padding: "14px 28px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Pay Now
                  </Button>
                </Section>

                <Text>
                  Your order will move into dression once payment has been
                  confirmed.
                </Text>
              </>
            ) : (
              <>
                <Text>
                  No payment is required at this time. Our team has already
                  begun processing your order.
                </Text>

                <Text>We'll keep you updated as your order progresses.</Text>
              </>
            )}

            <Text style={{ marginTop: "32px" }}>
              Thank you for choosing us.
            </Text>

            <Text>
              Best regards,
              <br />
              <strong>The Team</strong>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
