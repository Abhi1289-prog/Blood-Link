const user = require('../models/user');
const emailVarificationToken = require('../models/emailVerificationToken');
const passwordResetToken = require('../models/passwordresettoken');
const numberVerificationToken = require('../models/numberVerificationToken');
const jwt = require("jsonwebtoken");
const { generateotp, send_mail} = require('../utils/mail');
const {sendsms}=require('../utils/sms');
const { sendError, generateRandomByte } = require('../utils/helper');

exports.createUser = async(req, res) => {
   const {name, email, password, phone_number,username} = req.body;
   const olduser = await user.findOne({email});
   if(olduser) return sendError(res, 'This email is already used');
   const newuser = new user({name, email, password, phone_number,username})
   await newuser.save();
   res.status(201).json({ message: "User created successfully" });
};

exports.sendSMSOTP = async (req, res) => {
  try {
    const { number } = req.body;

    if (!number) return sendError(res, "Phone number is required");

    // Delete any previous OTPs for the number
    const existing = await numberVerificationToken.findOne({ number });
    if (existing) await numberVerificationToken.deleteOne({ _id: existing._id });

    // Generate OTP
    const otp = generateotp();

    sendsms(` From Blood link Your Verification Code:${otp}`,number);

    // Save OTP in database
    const newToken = new numberVerificationToken({ number, token: otp });
    await newToken.save();

    res.status(200).json({ message: "OTP sent to your number" });
  } catch (error) {
    console.error("Error sending SMS OTP:", error);
    res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
};

exports.sendEmailOTP = async (req, res) => {
  const { email } = req.body;

  const existing = await emailVarificationToken.findOne({ email });
  if (existing) await emailVarificationToken.deleteOne({ _id: existing._id });

  const otp = generateotp();
  const newToken = new emailVarificationToken({ email, token: otp });
  await newToken.save();
  
  send_mail(email, "Email Verification", `<h1>Your OTP is ${otp}<h1>`);
  res.status(200).json({ message: "OTP sent to email", email });
};

exports.verifyEmailOTP = async (req, res) => {
  const { email, otp } = req.body;
  const record = await emailVarificationToken.findOne({ email});
  if (!record) return sendError(res, "No OTP found for this email");

  const isMatch = await record.compareToken(otp);
  if (!isMatch) return sendError(res, "Invalid OTP");

  await emailVarificationToken.deleteOne({ _id: record._id });
  send_mail(email, "Email Verified", `<h1>Your Email is Verified</h1>`);

  res.status(200).json({ message: "Email verified successfully!" });
};

exports.resendEmailVerificationToken = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Email is required");
  const existing = await emailVarificationToken.findOne({ email });

  if (existing) {
    const timeDiff = (Date.now() - existing.createdAt) / 1000; // seconds
    if (timeDiff < 300) {
      return sendError(res, "Please wait 5 minutes before requesting a new OTP");
    }
    await emailVarificationToken.deleteOne({ _id: existing._id });
  }

  const otp = generateotp();
  const newToken = new emailVarificationToken({ email, token: otp });
  await newToken.save();

  send_mail(email, "Email Verification", `<h1>Your new OTP is: ${otp}</h1>`);
  res.status(200).json({ message: "New OTP has been sent to your email." });
};

exports.sendResetPasswordTokenStatus = (req, res) => {
  res.json({valid: true});
};

exports.resetPassword = async(req, res) => {
    const {newpassword, userId} = req.body;
    const User = await user.findById(userId);
    if (!User) return sendError(res, "User not found!");
    
    const matched = await User.comparePassword(newpassword);
    if(matched) return sendError(res, "The new password must be different from the old one!");
    
    User.password = newpassword;
    await User.save({ validateBeforeSave: false });
    await passwordResetToken.findByIdAndDelete(req.resetToken._id);
    
    send_mail(User.email, "Password Reset Successfully", `<h1>Password Reset Successfully</h1><br><p>Now you can use new password</p>`);
    res.json({message: "Password Reset Successfully, Now you can use new password"});
};

exports.signIn = async(req, res) => {
  const {username, password} = req.body;
  const User = await user.findOne({username});
  if(!User) return sendError(res, "Username/Password mismatch!");
  
  const matched = await User.comparePassword(password);
  if(!matched) return sendError(res, "Username/Password mismatch!");

  const {_id, name, email, phone_number, hasPersonalDetails} = User;  
  const jwtToken = jwt.sign({id: _id}, process.env.JWT_SECRET);
  
  // Save token to user document
  await user.findByIdAndUpdate(_id, { token: jwtToken });
  
  res.json({user:{id: _id, name, email, phone_number, hasPersonalDetails, token: jwtToken}});
};

exports.verifyNumber = async(req, res) => {
  const { number, otp } = req.body;

  const record = await numberVerificationToken.findOne({number});
  if (!record) return sendError(res, "No OTP found for this Number");

  const isMatch = await record.compareToken(otp);
  if (!isMatch) return sendError(res, "Invalid OTP");

  await numberVerificationToken.deleteOne({ _id: record._id });
  sendsms("From Blood link Number verified successfully", number);
  res.status(200).json({ message: "Number verified successfully!" });
};

exports.resendSMSVerificationToken = async (req, res) => {
  const { number } = req.body;

  if (!number) return sendError(res, "Number is required"); 
  
  const existing = await numberVerificationToken.findOne({ number });

  if (existing) {
    const timeDiff = (Date.now() - existing.createdAt) / 1000; // seconds
    if (timeDiff < 300) {
      return sendError(res, "Please wait 5 minutes before requesting a new OTP");
    }
    await numberVerificationToken.deleteOne({ _id: existing._id });
  }

  const otp = generateotp();
  const newToken = new numberVerificationToken({ number, token: otp });
  await newToken.save();

  sendsms(`Your new OTP is: ${otp}`, number);
  res.status(200).json({ message: "New OTP has been sent to your number." });
};

exports.forgetpassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return sendError(res, "Email is required");

  const User = await user.findOne({ email });
  if (!User) return sendError(res, "User not found with this email!");

  // Remove existing reset token if any
  const existingToken = await passwordResetToken.findOne({ owner: User._id });
  if (existingToken) await passwordResetToken.deleteOne({ _id: existingToken._id });

  // Generate random token
  const token = await generateRandomByte();
  
  // Create and save new password reset token
  const newPasswordResetToken = await new passwordResetToken({
    owner: User._id,
    token
  });
  await newPasswordResetToken.save();

  // Generate reset link
  const resetPasswordUrl = `http://localhost:3000/ResetPassword?token=${token}&id=${User._id}`;

  // Send email
  send_mail(
    User.email,
    "Password Reset",
    `<h1>Reset Password</h1>
    <p>Click here to reset your password</p>
    <a href="${resetPasswordUrl}">Reset Password</a>`
  );

  res.json({ message: "Password reset link has been sent to your email." });
};

exports.logout = async (req, res) => {
  try {
    const user_id = req.user.id;
    await user.findByIdAndUpdate(user_id, { token: null });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error logging out', error: error.message });
  }
};
