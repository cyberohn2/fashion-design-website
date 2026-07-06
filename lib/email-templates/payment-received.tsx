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

type PaymentReceivedEmailProps = {
  customerName: string;
  orderNumber: string;
};

export default function PaymentReceivedEmail({
  customerName,
  orderNumber,
}: PaymentReceivedEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>Payment Received!</Preview>

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
              Your payment has been received!
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
              Great news! Payment for your order n° {orderNumber} has been
              successfully received. Your order is now being processed.
            </Text>

            <Hr />

            <Text>
              <strong>Order Number:</strong> {orderNumber}
            </Text>

            <Hr />

            <Text>We'll keep you updated as your order progresses.</Text>

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
