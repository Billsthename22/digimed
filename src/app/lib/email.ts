import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const result = await resend.emails.send({
      from: "DigiMed <onboarding@resend.dev>", // replace with your verified domain later
      to,
      subject,
      html,
    });
    return result;
  } catch (error) {
    console.error("Email send error:", error);
    // Don't throw — email failure shouldn't break the main flow
    return null;
  }
}