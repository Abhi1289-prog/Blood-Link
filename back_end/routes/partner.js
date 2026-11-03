// const express = require('express');
// // Destructure only the functions that exist in your controller
// const { 
//   createUser,
//   sendEmailOTP, 
//   sendSMSOTP,
//   verifyEmailOTP,
//   resendEmailVerificationToken, 
//   sendResetPasswordTokenStatus,
//   resetPassword, 
//   signIn,
//   verifyNumber,
//   resendSMSVerificationToken,
//   forgetpassword
// } = require('../controller/partner');

// const { isValidPasswordResetToken } = require('../middelwares/user');
// const { 
//   userValidate, 
//   validate, 
//   validatePassword,
//   signInValidation,
//   numerValidation
// } = require('../middelwares/validator');
// const router = express.Router();

// router.post('/create', userValidate, validate, createUser);
// router.post('/send-email-otp', validate, sendEmailOTP);
// router.post('/send-number-otp', sendSMSOTP);
// router.post('/verify-email', verifyEmailOTP);
// router.post('/resend-verification-token', resendEmailVerificationToken);
// router.post('/ForgotPassword2', forgetpassword); 
// router.post('/verify-pass-reset-token', isValidPasswordResetToken, sendResetPasswordTokenStatus);
// router.post('/reset-password', validatePassword, validate, isValidPasswordResetToken, resetPassword);
// router.post('/signin', signInValidation, validate, signIn);
// router.post('/sms-otp', verifyNumber);
// router.post('/resend-sms-otp', numerValidation, validate, resendSMSVerificationToken);

// module.exports = router;