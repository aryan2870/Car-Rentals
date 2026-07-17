const express = require("express");
const router = express.Router();
const Booking = require("../../models/Booking");
const nodemailer = require("nodemailer");

// Function to create a transporter with test service fallback
async function getTransporter() {
  // If SMTP_USER and SMTP_PASS are set, use them dynamically.
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
      // Default to SMTP_SERVICE (like gmail) if host is not specified
      return nodemailer.createTransport({
        service: process.env.SMTP_SERVICE || "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    }
  } else if (process.env.SMTP_PASS) {
    // Fallback if SMTP_PASS is defined but SMTP_USER is not, using legacy default
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aryansocial18@gmail.com",
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Generate test SMTP service account from ethereal.email (fallback for development)
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

// Route to save booking data and send confirmation email
router.post("/", async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();

    // Send email reservation details
    try {
      const transporter = await getTransporter();
      const senderEmail = process.env.SMTP_USER || "aryansocial18@gmail.com";
      const info = await transporter.sendMail({
        from: `"Car Rental Support" <${senderEmail}>`,
        to: newBooking.email,
        subject: "Reservation Confirmed - Car Rental",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #ff4d30; text-align: center;">Car Rental Booking Confirmed!</h2>
            <p>Dear <strong>${newBooking.firstName} ${newBooking.lastName}</strong>,</p>
            <p>Thank you for renting with us. Your reservation has been successfully confirmed. Below are your booking details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 10px; border: 1px solid #ddd; width: 40%;"><strong>Car Type:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.carType}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Pick-Up Location:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.pickUp}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Pick-Up Date & Time:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.pickTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Drop-Off Location:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.dropOff}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Drop-Off Date & Time:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.dropTime}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Phone Number:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.phone}</td>
              </tr>
              <tr style="background-color: #f2f2f2;">
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Age:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.age}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd;"><strong>Address:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd;">${newBooking.address}, ${newBooking.city}, ${newBooking.zipcode}</td>
              </tr>
            </table>

            <div style="background-color: #ffeae6; padding: 15px; border-radius: 5px; border-left: 5px solid #ff4d30; margin-top: 20px;">
              <p style="margin: 0; font-weight: bold; color: #ff4d30;">Important Information:</p>
              <p style="margin: 5px 0 0 0; font-size: 14px; color: #555;">Please bring your rental voucher and driver's license on arrival at the rental desk. For support, call us at (+91) 8263062423.</p>
            </div>
            
            <p style="margin-top: 20px; font-size: 12px; color: #888; text-align: center;">This is an automated email. Please do not reply directly to this message.</p>
          </div>
        `,
      });

      console.log("Message sent: %s", info.messageId);
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
      }
    } catch (emailError) {
      console.error("Failed to send booking email notification", emailError);
    }

    res.status(201).json({ message: "Booking saved successfully" });
  } catch (error) {
    console.error("Error saving booking", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;