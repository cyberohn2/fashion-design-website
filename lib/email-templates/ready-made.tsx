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

type OrderCreatedEmailProps = {
  customerName: string;
  orderNumber: string;
};

export default function ReadyMadeEmail({
  customerName,
  orderNumber,
}: OrderCreatedEmailProps) {
  return (
    <Html>
      <Head />

      <Preview>
        We've received your order and it will be reviewed shortly.
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
              backgroundColor: "#111111",
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
              Your Order Has Been Received
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
              Thank you for placing your order with us. We've successfully
              received it and our team will review the details shortly.
            </Text>

            <Hr />

            <Text>
              <strong>Order Number:</strong> {orderNumber}
            </Text>

            <Hr />

            <Text>
              Once your payment has been confirmed, we'll move on to dression.
            </Text>

            <Text>
              We appreciate your patience and look forward to serving you.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
