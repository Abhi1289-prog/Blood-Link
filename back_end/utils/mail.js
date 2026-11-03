require("dotenv").config();

const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// Create OAuth2 client
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Set refresh token
oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN
});

// OTP generator
exports.generateotp = (otp_length = 6) => {
  let otp = '';
  for (let i = 0; i < otp_length; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// Send mail function
exports.send_mail = async (recipient, sub, message) => {
  try {
    // Get access token
    const accessTokenResponse = await oauth2Client.getAccessToken();

    const accessToken =
      typeof accessTokenResponse === "object"
        ? accessTokenResponse.token
        : accessTokenResponse;

    console.log("Access Token:", accessToken);

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken
      }
    });

    // Mail options
    const mailOptions = {
      from: `Blood Link <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: sub,
      html: message
    };

    // Send mail
    const result = await transporter.sendMail(mailOptions);

    console.log("Mail sent:", result);

  } catch (error) {
    console.error("Error sending mail:", error);
  }
};
// require("dotenv").config();
// const nodemailer = require("nodemailer");

// exports.generateotp = (otp_length = 6) => {
//   let otp = '';
//   for (let i = 0; i < otp_length; i++) {
//     otp += Math.floor(Math.random() * 10);
//   }
//   return otp;
// };

// exports.send_mail = async (recipient, sub, message) => {
//   try {
//     console.log("USER:", process.env.EMAIL_USER);
//     console.log("PASS:", process.env.EMAIL_PASS);

//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS
//       }
//     });

//     const result = await transporter.sendMail({
//       from: `Blood Link <${process.env.EMAIL_USER}>`,
//       to: recipient,
//       subject: sub,
//       html: message
//     });

//     console.log("Mail sent:", result);

//   } catch (error) {
//     console.error("Error sending mail:", error);
//   }
// };
// require("dotenv").config();
// const sgMail = require("@sendgrid/mail");

// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// exports.generateotp = (otp_length = 6) => {
//   let otp = '';
//   for (let i = 0; i < otp_length; i++) {
//     otp += Math.floor(Math.random() * 10);
//   }
//   return otp;
// };

// exports.send_mail = async (recipient, sub, message) => {
//   try {
//     const msg = {
//       to: recipient,
//       from: process.env.EMAIL_USER, // must be verified
//       subject: sub,
//       html: message
//     };

//     const result = await sgMail.send(msg);

//     console.log("Mail sent:", result);

//   } catch (error) {
//     console.error("Error sending mail:", error.response?.body || error);
//   }
// };