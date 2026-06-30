import { transporter } from "./mail";

type SendEmailProps = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail({ to, subject, html, text }: SendEmailProps) {
  return transporter.sendMail({
    from: `"George Wears" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
    text,
  });
}
