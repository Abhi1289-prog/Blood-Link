require("dotenv").config();
const nodemailer = require("nodemailer");

// OTP generator
exports.generateotp = (otp_length = 6) => {
  let otp = '';
  for (let i = 0; i < otp_length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// Send mail function using App Password
exports.send_mail = async (recipient, sub, message) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Put your 16-character App Password here
      }
    });

    const result = await transporter.sendMail({
      from: `Blood Link <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: sub,
      html: message
    });

    console.log("Mail sent successfully:", result.messageId);
    return result;

  } catch (error) {
    console.error("Error sending mail:", error);
    throw error;
  }
};