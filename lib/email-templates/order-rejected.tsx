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

type OrderRejectedProps = {
  customerName: string;
  orderNumber: string;
};

export default function OrderRejectedEmail({
  customerName,
  orderNumber,
}: OrderRejectedProps) {
  return (
    <Html>
      <Head />

      <Preview>We have an update regarding your recent order.</Preview>

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
              backgroundColor: "#dc3545",
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
              Order Update
            </Heading>
          </Section>

          {/* Content */}
          <Section
            style={{
              padding: "35px",
            }}
          >
            <Text>Hello {customerName},</Text>

            <Text>Thank you for your interest in our dresses.</Text>

            <Text>
              After reviewing your request, we're unfortunately unable to
              proceed with your order at this time.
            </Text>

            <Hr />

            <Text>
              <strong>Order Number:</strong> {orderNumber}
            </Text>

            <Hr />

            <Text>
              If you have any questions or would like assistance placing a
              different order, please don't hesitate to contact us. We'd be
              happy to help.
            </Text>

            <Text style={{ marginTop: "32px" }}>
              Thank you for your understanding.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
