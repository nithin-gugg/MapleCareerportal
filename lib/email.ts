import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_PORT === "465", // Use SSL for port 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Reusable email sending helper.
 */
export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text: string;
}) {
  try {
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL || '"Maple HRMS" <noreply@hrms.com>',
      to,
      subject,
      html,
      text,
    });
    console.log("Email sent: %s", info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (_error) {
    console.error("Email Sending Failed. Please check SMTP configuration.");
    return { success: false, error: "SMTP_ERROR" };
  }
}
