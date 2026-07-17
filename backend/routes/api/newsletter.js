const express = require("express");
const router = express.Router();
const Subscriber = require("../../models/Subscriber");
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

// POST /api/newsletter/subscribe
router.post("/subscribe", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required." });
  }

  try {
    // Check if the user is already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      return res.status(400).json({ message: "This email is already subscribed!" });
    }

    // Save subscriber
    subscriber = new Subscriber({ email });
    await subscriber.save();

    // Send confirmation email
    try {
      const transporter = await getTransporter();
      const senderEmail = process.env.SMTP_USER || "aryansocial18@gmail.com";
      const info = await transporter.sendMail({
        from: `"Car Rental News" <${senderEmail}>`,
        to: email,
        subject: "Subscription Confirmed! - Car Rental Newsletter",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 550px; margin: auto; padding: 30px; border: 1px solid #eee; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
            <div style="text-align: center; margin-bottom: 25px;">
              <span style="font-size: 28px; font-weight: bold; color: #ff4d30; letter-spacing: -1px;">CAR <span style="color: #2d2d2d; font-weight: normal;">Rental</span></span>
            </div>
            <h2 style="color: #2d2d2d; text-align: center; margin-bottom: 10px; font-size: 22px;">You're Subscribed! 🎉</h2>
            <p style="color: #555555; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 25px;">
              Thank you for subscribing to our newsletter! You've successfully registered <strong>${email}</strong> for our latest updates, exclusive discounts, and company news.
            </p>
            
            <div style="background-color: #fcfcfc; padding: 20px; border: 1px dashed #ff4d30; border-radius: 8px; text-align: center; margin-bottom: 25px;">
              <span style="color: #ff4d30; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 5px;">Exclusive Subscriber Offer</span>
              <span style="color: #2d2d2d; font-size: 20px; font-weight: bold; display: block; margin-bottom: 10px;">Use code: WELCOME10</span>
              <p style="color: #777777; font-size: 13px; margin: 0;">Get 10% off on your first car rental booking with us!</p>
            </div>

            <p style="color: #555555; font-size: 15px; line-height: 1.6; text-align: center; margin-bottom: 25px;">
              If you didn't mean to subscribe, you can unsubscribe at any time by contacting our support desk.
            </p>
            
            <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 25px 0;" />
            
            <p style="font-size: 12px; color: #aaaaaa; text-align: center; margin: 0; line-height: 1.5;">
              This is an automated email. Please do not reply directly. <br />
              &copy; ${new Date().getFullYear()} Car Rental. All rights reserved.
            </p>
          </div>
        `,
      });

      console.log("Newsletter confirmation email sent: %s", info.messageId);
    } catch (emailError) {
      console.error("Failed to send newsletter confirmation email", emailError);
    }

    return res.status(200).json({ message: "Thank you for subscribing to our newsletter!" });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return res.status(500).json({ message: "Server error. Please try again." });
  }
});

module.exports = router;
