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

export default function OrderRefundEmail({
  customerName,
  orderNumber,
}: OrderRejectedProps) {
  return (
    <Html>
      <Head />

      <Preview>
        Your order has been rejected. Our team will contact you regarding your
        refund.
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
              Order Rejected
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
              We regret to inform you that your order has been rejected and will
              not be processed.
            </Text>

            <Hr />

            <Text>
              <strong>Order Number:</strong> {orderNumber}
            </Text>

            <Hr />

            <Text>
              If you have already made payment, there's no need to worry. Our
              support team will contact you shortly to guide you through the
              refund process.
            </Text>

            <Text>
              Please wait for our team to reach out with the next steps. If you
              have any urgent questions, feel free to reply to this email or
              contact our support team.
            </Text>

            <Text style={{ marginTop: "32px" }}>
              We sincerely apologize for the inconvenience and appreciate your
              understanding.
            </Text>

            <Text>Thank you for choosing us.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
