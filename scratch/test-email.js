const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, "../.env") });

async function testEmail() {
  console.log("--- SMTP CONFIG TEST ---");
  console.log("Host:", process.env.SMTP_HOST);
  console.log("User:", process.env.SMTP_USER);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_PORT === "465",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  try {
    console.log("Verifying connection...");
    await transporter.verify();
    console.log("✅ SMTP Connection Successful!");

    console.log("Sending test email...");
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to: process.env.SMTP_USER, // Send to self
      subject: "Maple HRMS - SMTP Test",
      text: "This is a test email from your HRMS system to verify SMTP configuration.",
      html: "<h1>✅ SMTP Test Successful</h1><p>This is a test email from your HRMS system.</p>",
    });

    console.log("✅ Test email sent! Message ID:", info.messageId);
  } catch (error) {
    console.error("❌ FAILED:", error.message);
  }
}

testEmail();
