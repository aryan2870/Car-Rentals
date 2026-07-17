const express = require("express");
const router = express.Router();
const Contact = require("../../models/Contact");
const nodemailer = require("nodemailer");

// SMTP Transporter Helper (reused from bookings service)
async function getTransporter() {
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    if (process.env.SMTP_HOST) {
      return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      return nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  } else if (process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aryansocial18@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  }
}

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields (name, email, message) are required." });
  }

  try {
    const newSubmission = new Contact({ name, email, message });
    await newSubmission.save();

    // Send copy of message to user
    try {
      const transporter = await getTransporter();
      const senderEmail = process.env.SMTP_USER || "aryansocial18@gmail.com";
      
      const info = await transporter.sendMail({
        from: `"Car Rental Support" <${senderEmail}>`,
        to: email,
        subject: "We received your message - Car Rental",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #ff4d30; text-align: center;">Message Received!</h2>
            <p>Dear <strong>${name}</strong>,</p>
            <p>Thank you for getting in touch with us. We have received your query and our support team will get back to you shortly.</p>
            
            <div style="background-color: #ffffff; padding: 15px; border-radius: 5px; border: 1px solid #eee; margin: 20px 0;">
              <h4 style="margin-top: 0; color: #333;">Your Message:</h4>
              <p style="font-style: italic; color: #555;">"${message}"</p>
            </div>

            <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">This is an automated copy. Please do not reply directly.</p>
          </div>
        `,
      });

      console.log("Contact support email sent: %s", info.messageId);
    } catch (emailError) {
      console.error("Failed to send contact support email confirmation", emailError);
    }

    res.status(201).json({ message: "Thank you! Your message has been sent successfully." });
  } catch (error) {
    console.error("Error saving contact submission", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
